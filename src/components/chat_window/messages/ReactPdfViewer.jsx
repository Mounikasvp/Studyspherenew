import React, { useState } from 'react';
import FileViewer from 'react-file-viewer';
import { Button, Loader } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faDownload } from '@fortawesome/free-solid-svg-icons';

const ReactPdfViewer = ({ url, fileName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Function to handle file loading
  const handleLoad = () => {
    setIsLoading(false);
  };

  // Function to handle errors
  const handleError = (error) => {
    console.error('Error in file viewer:', error);
    setIsLoading(false);
    setHasError(true);
  };

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

  // Extract file extension from fileName
  const getFileExtension = (name) => {
    return name.split('.').pop().toLowerCase();
  };

  const fileExtension = getFileExtension(fileName);

  return (
    <div className="react-pdf-container">
      {isLoading && (
        <div className="pdf-loading">
          <Loader size="md" content="Loading file..." vertical />
        </div>
      )}

      {hasError ? (
        <div className="pdf-error">
          <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '48px', color: '#e53e3e', marginBottom: '15px' }} />
          <p>Could not load file preview</p>
          <Button 
            appearance="primary" 
            onClick={handleDownload}
            style={{ marginTop: '15px' }}
          >
            <FontAwesomeIcon icon={faDownload} style={{ marginRight: '8px' }} />
            Download File
          </Button>
        </div>
      ) : (
        <div className="file-viewer-wrapper">
          <FileViewer
            fileType={fileExtension}
            filePath={url}
            onError={handleError}
            onLoad={handleLoad}
            errorComponent={() => (
              <div className="pdf-error">
                <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '48px', color: '#e53e3e', marginBottom: '15px' }} />
                <p>Could not load file preview</p>
                <Button 
                  appearance="primary" 
                  onClick={handleDownload}
                  style={{ marginTop: '15px' }}
                >
                  <FontAwesomeIcon icon={faDownload} style={{ marginRight: '8px' }} />
                  Download File
                </Button>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default ReactPdfViewer;
