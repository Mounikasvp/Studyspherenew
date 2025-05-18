import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router";
import { Button } from "rsuite";
import {
  ref as dbRef,
  off,
  onValue,
  query,
  orderByChild,
  equalTo,
  runTransaction,
  update,
  limitToLast,
} from "firebase/database";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { auth, database, storage } from "../../../misc/firebase.config";
import { groupBy, transformToArrWithId } from "../../../misc/helpers";
import MessageItem from "./MessageItem";
import { showConfirmDialog, showToast } from "../../../misc/sweet-alert";

const PAGE_SIZE = 15;
const messagesRef = dbRef(database, "/messages");

function shouldScrollToBottom(node, threshold = 30) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;

  return percentage > threshold;
}

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const loadMessages = useCallback(
    (limitToUse) => {
      const node = selfRef.current;

      off(messagesRef);

      console.log(`Loading messages for room: ${chatId}`);

      onValue(
        query(
          messagesRef,
          orderByChild("roomId"),
          equalTo(chatId),
          limitToLast(limitToUse || PAGE_SIZE)
        ),
        (snap) => {
          const data = transformToArrWithId(snap.val());
          console.log(`Received ${data ? data.length : 0} messages for room ${chatId}`);

          // Additional check to ensure messages belong to this room
          const filteredData = data ? data.filter(msg => {
            // Strict check to ensure roomId matches exactly
            const matches = msg.roomId === chatId;
            if (!matches) {
              console.warn(`Message ${msg.id} has incorrect roomId: ${msg.roomId}, expected: ${chatId}`);

              // Log message details for debugging
              if (msg.file && msg.file.contentType && msg.file.contentType.includes('audio')) {
                console.warn('Audio message with wrong roomId:', msg);
              }
            }
            return matches;
          }) : [];

          if (data && data.length !== filteredData.length) {
            console.warn(`Filtered out ${data.length - filteredData.length} messages with incorrect roomId`);
          }

          setMessages(filteredData);

          if (shouldScrollToBottom(node)) {
            node.scrollTop = node.scrollHeight;
          }
        }
      );

      setLimit((p) => p + PAGE_SIZE);
    },
    [chatId]
  );

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;

    loadMessages(limit);

    setTimeout(() => {
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight - oldHeight;
    }, 200);
  }, [loadMessages, limit]);

  useEffect(() => {
    const node = selfRef.current;

    loadMessages();

    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 200);

    return () => {
      off(messagesRef);
    };
  }, [loadMessages]);

  const handleAdmin = useCallback(
    async (uid) => {
      let alertMsg;

      await runTransaction(
        dbRef(database, `/rooms/${chatId}/admins`),
        (admins) => {
          if (admins) {
            if (admins[uid]) {
              admins[uid] = null;
              alertMsg = "Admin permission removed";
            } else {
              admins[uid] = true;
              alertMsg = "Admin permission granted";
            }
          }
          return admins;
        }
      );

      // Use SweetAlert2 toast notification
      showToast(alertMsg, 'info');
    },
    [chatId]
  );

  const handleLike = useCallback(async (msgId) => {
    const { uid } = auth.currentUser;
    const messageRef = dbRef(database, `/messages/${msgId}`);

    let alertMsg;

    await runTransaction(messageRef, (msg) => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = "Like removed";
        } else {
          msg.likeCount += 1;

          if (!msg.likes) {
            msg.likes = {};
          }

          msg.likes[uid] = true;
          alertMsg = "Like added";
        }
      }

      return msg;
    });

    // Use SweetAlert2 toast notification
    showToast(alertMsg, 'info');
  }, []);

  const handleDelete = useCallback(
    async (msgId, file) => {
      // Use SweetAlert2 for confirmation
      const result = await showConfirmDialog(
        'Delete Message',
        'Are you sure you want to delete this message?',
        'Yes, delete it',
        'Cancel'
      );

      // If user cancels, return early
      if (!result.isConfirmed) {
        return;
      }

      const isLast = messages[messages.length - 1].id === msgId;

      const updates = {};

      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await update(dbRef(database), updates);

        // Use SweetAlert2 toast notification
        showToast('Message has been deleted', 'success');
      } catch (err) {
        showToast(err.message, 'error');
        return;
      }

      // If file exists and is not a base64 file (meaning it's stored in Firebase Storage)
      if (file && !file.isBase64) {
        try {
          const fileRef = storageRef(storage, file.url);
          await deleteObject(fileRef);
        } catch (err) {
          showToast(err.message, 'error');
        }
      }
      // Base64 files are deleted automatically when the message is deleted from the database
    },
    [chatId, messages]
  );

  // Helper function to format date headers
  const formatDateHeader = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }

    // Check if date is yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }

    // For older dates, show a more friendly format
    return date.toLocaleDateString([], {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const renderMessages = () => {
    const groups = groupBy(messages, (item) =>
      new Date(item.createdAt).toDateString()
    );

    const items = [];

    Object.keys(groups).forEach((date) => {
      const formattedDate = formatDateHeader(date);
      items.push(
        <li
          key={date}
          className="text-center mb-2 mt-2"
          style={{
            padding: '5px 10px',
            backgroundColor: 'rgba(0, 0, 0, 0.03)',
            borderRadius: '15px',
            display: 'inline-block',
            margin: '0 auto',
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#555'
          }}
        >
          {formattedDate}
        </li>
      );

      const msgs = groups[date].map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          handleAdmin={handleAdmin}
          handleLike={handleLike}
          handleDelete={handleDelete}
        />
      ));

      items.push(...msgs);
    });

    return items;
  };

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {messages && messages.length >= PAGE_SIZE && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={onLoadMore} color="green" appearance="primary">
            Load more
          </Button>
        </li>
      )}
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages && renderMessages()}
    </ul>
  );
};

export default Messages;
