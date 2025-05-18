import React, { useState } from 'react';
import { Button, Modal, Loader } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faDownload, faExpand } from '@fortawesome/free-solid-svg-icons';
import { useModalState } from '../../../misc/custom-hooks';
import SimplePdfJsViewer from './SimplePdfJsViewer';

const DirectPdfViewer = ({ url, fileName }) => {
  const { isOpen, open, close } = useModalState();
  const [isDownloading, setIsDownloading] = useState(false);

  // Function to download the file
  const handleDownload = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsDownloading(true);

    try {
      // Create an anchor element
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
    } catch (error) {
      console.error('Error downloading file:', error);
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="file-attachment" onClick={open} style={{ cursor: 'pointer' }} title="Click to open PDF">
        <div
          className="file-icon"
          style={{ color: '#e53e3e' }}
        >
          <FontAwesomeIcon icon={faFilePdf} />
        </div>

        <div className="file-info">
          <div className="file-name">
            {fileName}
          </div>
          <div className="file-details">
            <span className="file-type">PDF</span>
            <span className="file-action-hint">(Click to view)</span>
          </div>
        </div>

        <div className="file-actions">
          <Button
            appearance="link"
            className="view-btn"
            onClick={(e) => {
              e.stopPropagation();
              open();
            }}
            title="View PDF"
          >
            <FontAwesomeIcon icon={faExpand} />
          </Button>
          <Button
            appearance="link"
            className="download-btn"
            onClick={handleDownload}
            title="Download PDF"
          >
            {isDownloading ? <Loader size="xs" /> : <FontAwesomeIcon icon={faDownload} />}
          </Button>
        </div>
      </div>

      <Modal open={isOpen} onClose={close} className="pdf-modal" size="lg" full>
        <Modal.Header>
          <Modal.Title>
            <FontAwesomeIcon icon={faFilePdf} style={{ marginRight: '8px', color: '#e53e3e' }} />
            {fileName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="pdf-viewer-container">
            <SimplePdfJsViewer url={url} fileName={fileName} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            appearance="primary"
            onClick={handleDownload}
            style={{
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 15px',
              fontWeight: '600'
            }}
          >
            <FontAwesomeIcon icon={faDownload} style={{ marginRight: '8px' }} />
            Download
          </Button>
          <Button onClick={close} appearance="subtle">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DirectPdfViewer;
