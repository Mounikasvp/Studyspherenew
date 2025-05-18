import React, { useState, useCallback } from "react";
import { Button, Form, Modal } from "rsuite";
import { useModalState } from "../misc/custom-hooks";
import { ref, get, set, serverTimestamp } from "firebase/database";
import { database, auth } from "../misc/firebase.config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { showSuccessAlert, showErrorAlert, showInfoAlert } from "../misc/sweet-alert";

const JoinRoomModal = () => {
  const { isOpen, open, close } = useModalState();
  const [roomCode, setRoomCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onCodeChange = useCallback((value) => {
    setRoomCode(value);
  }, []);

  const onJoinRoom = async () => {
    if (!roomCode.trim()) {
      showErrorAlert('Error', 'Please enter a room code');
      return;
    }

    setIsLoading(true);

    try {
      // Query for the room with this code
      const roomsRef = ref(database, "rooms");
      const snapshot = await get(roomsRef);

      let roomId = null;
      let roomData = null;

      if (snapshot.exists()) {
        const rooms = snapshot.val();

        // Find the room with matching code
        for (const [id, room] of Object.entries(rooms)) {
          if (room.roomCode && room.roomCode.toUpperCase() === roomCode.toUpperCase()) {
            roomId = id;
            roomData = room;
            break;
          }
        }
      }

      if (!roomId) {
        showErrorAlert('Invalid Code', 'Invalid room code. Please check and try again.');
        setIsLoading(false);
        return;
      }

      // Check if the room is private and the user is not already a member
      if (roomData.isPrivate && (!roomData.members || !roomData.members[auth.currentUser.uid])) {
        // Add user to room members
        await set(ref(database, `rooms/${roomId}/members/${auth.currentUser.uid}`), true);

        // Add room to user's joined rooms
        await set(ref(database, `user-rooms/${auth.currentUser.uid}/${roomId}`), {
          joinedAt: serverTimestamp(),
          role: 'member'
        });

        await showSuccessAlert('Success', `Successfully joined ${roomData.name}!`);
      } else if (!roomData.isPrivate) {
        // For public rooms, just add the user as a member if they're not already
        if (!roomData.members || !roomData.members[auth.currentUser.uid]) {
          await set(ref(database, `rooms/${roomId}/members/${auth.currentUser.uid}`), true);

          // Add room to user's joined rooms
          await set(ref(database, `user-rooms/${auth.currentUser.uid}/${roomId}`), {
            joinedAt: serverTimestamp(),
            role: 'member'
          });
        }

        await showSuccessAlert('Success', `Successfully joined ${roomData.name}!`);
      } else {
        showInfoAlert('Already Joined', 'You are already a member of this room.');
      }

      setRoomCode("");
      setIsLoading(false);
      close();
    } catch (error) {
      showErrorAlert('Error', error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-1">
      <Button block appearance="ghost" onClick={open} className="join-room-btn">
        <FontAwesomeIcon icon={faSignInAlt} /> Join Room with Code
      </Button>

      <Modal open={isOpen} onClose={close} className="join-room-modal">
        <Modal.Header>
          <Modal.Title>Join a Study Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group>
              <Form.ControlLabel>Enter Room Code</Form.ControlLabel>
              <Form.Control
                name="roomCode"
                placeholder="Enter 6-digit code..."
                value={roomCode}
                onChange={onCodeChange}
                size="sm"
              />
              <Form.HelpText>
                Enter the code provided by the room admin
              </Form.HelpText>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            onClick={onJoinRoom}
            disabled={isLoading}
            size="sm"
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '8px',
              fontWeight: '600'
            }}
          >
            Join Room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JoinRoomModal;
