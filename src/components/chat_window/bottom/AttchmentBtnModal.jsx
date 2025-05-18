import React, { useState, useRef } from "react";
import { useParams } from "react-router";
import { Button, InputGroup, Message, Modal, toaster, Uploader } from "rsuite";
import { useModalState } from "../../../misc/custom-hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import "../../../styles/file-uploader.css";

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

    // Modify file names to prevent overflow
    const modifiedFiles = filtered.map(file => {
      // Create a new file object with the same properties
      const newFile = { ...file };

      // Truncate the file name if it's too long
      const maxLength = 12;
      let displayName = file.name;
      if (displayName.length > maxLength) {
        const parts = displayName.split('.');
        const extension = parts.length > 1 ? parts.pop() : '';
        const name = parts.join('.');
        displayName = name.substring(0, maxLength - extension.length - 3) + '...' + (extension ? '.' + extension : '');
      }

      // Store the original name for upload
      newFile.originalName = file.name;
      // Set the display name
      newFile.name = displayName;

      return newFile;
    });

    setFileList(modifiedFiles);
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
            // Use the original file name we stored, or fall back to blob name or display name
            const originalFileName = f.originalName || f.blobFile.name || f.name;

            resolve({
              contentType: f.blobFile.type,
              name: originalFileName,
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

      // Reset the file list after successful upload
      setFileList([]);
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

      <Modal open={isOpen} onClose={close} className="share-file-modal">
        <Modal.Header>
          <Modal.Title>
            <FontAwesomeIcon icon={faPaperclip} style={{ marginRight: '8px', color: '#7c3aed' }} />
            Share Files
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: '10px', width: '100%' }}>
          <Uploader
            autoUpload={false}
            action=""
            fileList={fileList}
            onChange={onChange}
            multiple
            listType="picture-text"
            className="w-100 file-uploader custom-uploader"
            disabled={isLoading}
            renderFileInfo={(file, fileElement) => {
              return (
                <div className="rs-uploader-file-item-info" style={{
                  width: '100%',
                  maxWidth: '100%',
                  overflow: 'hidden'
                }}>
                  <div className="rs-uploader-file-item-name"
                    title={file.originalName || file.blobFile.name || file.name}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                      fontSize: '0.9rem'
                    }}>
                    {file.name}
                  </div>

                  {isLoading && <div className="rs-uploader-file-item-status" style={{
                    width: '100%',
                    textAlign: 'left',
                    fontSize: '0.8rem',
                    color: '#4f46e5'
                  }}>Uploading...</div>}
                </div>
              );
            }}
            renderThumbnail={() => null}
            style={{ width: '100%' }}
            renderFileItem={(file, fileElement) => {
              return (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  backgroundColor: '#e9e9e9',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  marginBottom: '5px',
                  boxSizing: 'border-box',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#4f46e5',
                    marginRight: '10px',
                    flexShrink: 0
                  }}>
                    <i className="rs-icon rs-icon-file-text"></i>
                  </div>
                  <div style={{
                    flex: '1',
                    minWidth: '0',
                    overflow: 'hidden'
                  }}>
                    {fileElement}
                  </div>
                </div>
              );
            }}

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
              borderRadius: '10px',
              padding: '8px',
              fontWeight: '600',
              fontSize: '0.95rem'
            }}
          >
            Send to Chat
          </Button>
          <div className="text-right mt-1">
            <small>* Files up to 5MB are supported</small>
            <small>* Supported file types: images, documents, PDFs, videos, audio, etc.</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttchmentBtnModal;
