import React, { useState, useEffect } from 'react';
import { Loader, Button } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faDownload, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/file-viewer.css';

const PdfJsViewer = ({ url, fileName }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Function to open in new tab
  const openInNewTab = () => {
    window.open(url, '_blank');
  };

  // Force loading to complete after a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Function to download the file
  const handleDownload = () => {
    try {
      // Create an anchor element
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="pdf-js-viewer">
      {isLoading && (
        <div className="pdf-loading">
          <Loader size="md" content="Loading PDF..." vertical />
        </div>
      )}

      <div className="pdf-preview-container">
        <div className="pdf-icon-container">
          <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '48px', color: '#e53e3e', marginBottom: '15px' }} />
          <p>{fileName}</p>
        </div>

        <div className="pdf-actions">
          <Button
            appearance="primary"
            onClick={openInNewTab}
            style={{ marginRight: '10px' }}
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} style={{ marginRight: '8px' }} />
            Open PDF
          </Button>

          <Button
            appearance="primary"
            onClick={handleDownload}
          >
            <FontAwesomeIcon icon={faDownload} style={{ marginRight: '8px' }} />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PdfJsViewer;
