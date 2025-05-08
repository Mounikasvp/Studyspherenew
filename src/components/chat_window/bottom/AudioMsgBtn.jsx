import React, { useState, useCallback, useRef } from "react";
import { InputGroup, Message, toaster, Modal, Button } from "rsuite";
import { useParams } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone, faPlay, faPause, faPaperPlane, faTrash } from "@fortawesome/free-solid-svg-icons";
import { showToast } from "../../../misc/sweet-alert";
import { AudioRecorder } from 'react-audio-voice-recorder';
import "../../../styles/audio-preview.css";

const AudioMsgBtn = ({ afterUpload }) => {
  // Get the current chatId from URL parameters
  const { chatId } = useParams();

  // Use a ref to store the chatId at the time recording starts
  const recordingChatIdRef = useRef(null);

  const [isUploading, setIsUploading] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Reference to the audio element
  const audioRef = useRef(null);

  // Handle when recording completes
  const addAudioElement = useCallback((blob) => {
    console.log('Recording completed, preparing preview');
    recordingChatIdRef.current = chatId;

    // Create URL for the audio blob
    const audioUrl = URL.createObjectURL(blob);
    setAudioBlob(blob);
    setAudioUrl(audioUrl);

    // Show the preview modal
    setShowPreviewModal(true);
  }, [chatId]);

  // Toggle play/pause of the audio preview
  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // Handle audio playback ended
  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Cancel and close the preview modal
  const handleCancel = useCallback(() => {
    setShowPreviewModal(false);
    setAudioBlob(null);
    setAudioUrl(null);

    // Revoke the object URL to free up memory
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  }, [audioUrl]);

  // Send the audio message
  const handleSend = useCallback(async () => {
    if (!audioBlob) {
      console.error('No audio blob available');
      return;
    }

    // Use the chatId that was stored when recording started
    const targetChatId = recordingChatIdRef.current;
    console.log(`AudioMsgBtn: Processing audio for chat ID ${targetChatId}`);

    if (!targetChatId) {
      console.error('No target chatId found for audio message');
      toaster.push(
        <Message type="error" closable duration={4000}>
          Error: Could not determine which chat to send audio to
        </Message>
      );
      return;
    }

    setIsUploading(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);

      reader.onloadend = () => {
        const base64data = reader.result;

        const file = {
          contentType: 'audio/mp3',
          name: `audio_${Date.now()}.mp3`,
          url: base64data,
          isBase64: true
        };

        console.log(`Audio message created for room: ${targetChatId}`);

        // Close the modal
        setShowPreviewModal(false);

        // Pass the stored chatId explicitly to ensure it's correct
        afterUpload([file], targetChatId);

        // Clean up
        setAudioBlob(null);
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl);
          setAudioUrl(null);
        }

        setIsUploading(false);
      };

      reader.onerror = (error) => {
        throw new Error('Failed to convert audio to base64');
      };
    } catch (error) {
      setIsUploading(false);
      toaster.push(
        <Message type="error" closable duration={4000}>{error.message}</Message>
      );
    }
  }, [audioBlob, audioUrl, afterUpload]);

  return (
    <>
      <div className="audio-recorder-wrapper">
        <AudioRecorder
          onRecordingComplete={addAudioElement}
          audioTrackConstraints={{
            noiseSuppression: true,
            echoCancellation: true,
          }}
          downloadOnSavePress={false}
          downloadFileExtension="mp3"
          showVisualizer={true}
        />
      </div>

      {/* Audio Preview Modal */}
      <Modal open={showPreviewModal} onClose={handleCancel} size="xs">
        <Modal.Header>
          <Modal.Title>
            <FontAwesomeIcon icon={faMicrophone} className="mr-2" style={{ color: '#7c3aed' }} />
            Audio Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex flex-column align-items-center">
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={handleAudioEnded}
              className="d-none"
              controls={false}
            />

            <div className="audio-preview-controls mb-3">
              <Button
                appearance="primary"
                circle
                size="lg"
                onClick={togglePlayPause}
                className="mx-2"
                style={{
                  background: isPlaying
                    ? 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)'
                    : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  color: 'white',
                  border: 'none',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
              </Button>
            </div>

            <div className="audio-waveform-placeholder"></div>

            <p className="text-center text-muted" style={{ fontSize: '0.9rem', marginTop: '10px' }}>
              {isPlaying ? 'Playing audio...' : 'Listen to your recording before sending'}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            appearance="subtle"
            onClick={handleCancel}
            className="mr-2"
            disabled={isUploading}
            style={{
              color: '#6b7280',
              fontWeight: '500'
            }}
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            Cancel
          </Button>
          <Button
            appearance="primary"
            onClick={handleSend}
            disabled={isUploading}
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 15px',
              fontWeight: '600',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            {isUploading ? 'Sending...' : (
              <>
                <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                Send
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AudioMsgBtn;
