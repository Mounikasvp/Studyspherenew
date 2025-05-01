import React, { useState, useRef } from "react";
import { useParams } from "react-router";
import { Button, InputGroup, Message, Modal, toaster, Uploader } from "rsuite";
import { useModalState } from "../../../misc/custom-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";

// Increased file size limit for base64 storage in database
const MAX_FILE_SIZE = 1000 * 1024 * 5; // 5MB max

const AttchmentBtnModal = ({ afterUpload }) => {
  const { chatId } = useParams();
  const { isOpen, open, close } = useModalState();

  // Store the chatId when the modal is opened
  const modalChatIdRef = useRef(null);

  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Update the stored chatId when opening the modal
  const handleOpen = () => {
    modalChatIdRef.current = chatId;
    console.log(`Attachment modal opened for chat: ${modalChatIdRef.current}`);
    open();
  };

  const onChange = (fileArr) => {
    const filtered = fileArr
      .filter((el) => el.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);

    setFileList(filtered);
  };

  const onUpload = async () => {
    if (fileList.length === 0) {
      return;
    }

    // Use the stored chatId from when the modal was opened
    const targetChatId = modalChatIdRef.current;

    if (!targetChatId) {
      console.error('No target chatId found for file upload');
      toaster.push(
        <Message type="error" closable duration={4000}>
          Error: Could not determine which chat to send files to
        </Message>
      );
      return;
    }

    console.log(`Uploading files to chat: ${targetChatId}`);
    setIsLoading(true);

    try {
      const filesPromises = fileList.map((f) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(f.blobFile);

          reader.onload = () => {
            resolve({
              contentType: f.blobFile.type,
              name: f.name,
              url: reader.result, // This is the base64 string
              isBase64: true
            });
          };

          reader.onerror = (error) => {
            reject(error);
          };
        });
      });

      const files = await Promise.all(filesPromises);

      // Explicitly pass the stored chatId to ensure messages go to the correct room
      await afterUpload(files, targetChatId);

      setIsLoading(false);
      close();
    } catch (err) {
      setIsLoading(false);
      toaster.push(
        <Message type="error" closable duration={4000}>
          {err.message}
        </Message>
      );
    }
  };

  return (
    <>
      <InputGroup.Button onClick={handleOpen} className="attachment-btn">
        <FontAwesomeIcon icon={faPaperclip} />
      </InputGroup.Button>

      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>
            <FontAwesomeIcon icon={faPaperclip} style={{ marginRight: '8px', color: '#7c3aed' }} />
            Share Files
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            autoUpload={false}
            action=""
            fileList={fileList}
            onChange={onChange}
            multiple
            listType="picture-text"
            className="w-100"
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            disabled={isLoading}
            onClick={onUpload}
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '10px',
              fontWeight: '600'
            }}
          >
            Send to Chat
          </Button>
          <div className="text-right mt-2">
            <small>* Files up to 5MB are supported</small>
            <br/>
            <small>* Supported file types: images, documents, PDFs, videos, audio, etc.</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttchmentBtnModal;
