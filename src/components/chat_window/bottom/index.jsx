import React, { useCallback, useState } from "react";
import { Input, InputGroup, Message, toaster } from "rsuite";
import { serverTimestamp, ref, push, update } from "firebase/database";
import { useParams } from "react-router";
import { useProfile } from "../../../context/profile.context";
import { database } from "../../../misc/firebase.config";
import AttchmentBtnModal from "./AttchmentBtnModal";
import AudioMsgBtn from "./AudioMsgBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function assembleMessage(profile, chatId) {
  // Ensure chatId is a string and not undefined
  if (!chatId) {
    console.error('Missing chatId in assembleMessage');
    throw new Error('Missing chatId in assembleMessage');
  }

  console.log(`Assembling message for room: ${chatId}`);

  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    createdAt: serverTimestamp(),
    likeCount: 0,
  };
}

const ChatBottom = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { chatId } = useParams();
  const { profile } = useProfile();

  const onInputChange = useCallback((value) => {
    setInput(value);
  }, []);

  const onSendClick = async () => {
    if (input.trim() === "") return;

    const msgData = assembleMessage(profile, chatId);
    msgData.text = input;

    const updates = {};

    const messageId = push(ref(database, "messages")).key;

    updates[`/messages/${messageId}`] = msgData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...msgData,
      msgId: messageId,
    };

    setIsLoading(true);

    try {
      await update(ref(database), updates);

      setInput("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toaster.push(
        <Message type="error" closable duration={4000}>
          {error.message}
        </Message>
      );
    }
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      onSendClick();
    }
  };

  const afterUpload = useCallback(
    async (files, explicitChatId = null) => {
      // Use the explicitly provided chatId if available, otherwise use the one from URL params
      const targetChatId = explicitChatId || chatId;

      // Validate that we have a valid chatId
      if (!targetChatId) {
        console.error('Missing chatId in afterUpload');
        toaster.push(
          <Message type="error" closable duration={4000}>
            Error: Could not determine which chat to send to
          </Message>
        );
        setIsLoading(false);
        return;
      }

      console.log(`ChatBottom: Processing upload for chat ID ${targetChatId} (URL param chatId: ${chatId})`);

      setIsLoading(true);

      try {
        // Create a separate updates object for each target chat
        // This ensures messages go to the correct rooms
        const updates = {};

        files.forEach((file) => {
          try {
            // Create message data with the target chatId
            const msgData = assembleMessage(profile, targetChatId);

            // Remove any roomId from the file object to avoid conflicts
            const { roomId: fileRoomId, ...fileWithoutRoomId } = file;

            // Set the file data
            msgData.file = fileWithoutRoomId;

            // Log for debugging
            console.log(`Preparing message for room: ${targetChatId}`, msgData);

            const messageId = push(ref(database, "messages")).key;
            updates[`/messages/${messageId}`] = msgData;

            // Set last message for this room
            updates[`/rooms/${targetChatId}/lastMessage`] = {
              ...msgData,
              msgId: messageId,
            };
          } catch (fileError) {
            console.error(`Error processing file for room ${targetChatId}:`, fileError);
          }
        });

        // Only proceed if we have updates to make
        if (Object.keys(updates).length > 0) {
          await update(ref(database), updates);
          console.log(`Successfully saved message(s) to room: ${targetChatId}`);
        } else {
          console.error('No valid updates to send to Firebase');
        }

        setIsLoading(false);
      } catch (err) {
        console.error(`Error saving message to room ${targetChatId}:`, err);
        setIsLoading(false);
        toaster.push(
          <Message type="error" closable duration={4000}>
            {err.message}
          </Message>
        );
      }
    },
    [profile, chatId]
  );

  return (
    <div>
      <InputGroup className="input-group">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <AttchmentBtnModal afterUpload={afterUpload} />
          <AudioMsgBtn afterUpload={afterUpload} />
        </div>
        <Input
          placeholder="Type your message here..."
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
        />
        <InputGroup.Button
          appearance="primary"
          onClick={onSendClick}
          disabled={isLoading}
          className="send-btn"
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default ChatBottom;
