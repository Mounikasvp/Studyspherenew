import React from 'react';
import { Button } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

const SimplePdfViewer = ({ url, fileName }) => {
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

  // Function to open in new tab
  const openInNewTab = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="simple-pdf-container">
      <object
        data={url}
        type="application/pdf"
        width="100%"
        height="100%"
        className="pdf-object"
      >
        <div className="pdf-fallback">
          <p>Your browser doesn't support embedded PDFs.</p>
          <div className="pdf-fallback-actions">
            <Button 
              appearance="primary" 
              onClick={openInNewTab}
              style={{ marginRight: '10px' }}
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} style={{ marginRight: '8px' }} />
              Open in New Tab
            </Button>
            <Button 
              appearance="primary" 
              onClick={handleDownload}
            >
              <FontAwesomeIcon icon={faDownload} style={{ marginRight: '8px' }} />
              Download
            </Button>
          </div>
        </div>
      </object>
    </div>
  );
};

export default SimplePdfViewer;
