import React, { useState, useEffect, useRef } from 'react';
import { Loader, Button } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faDownload } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/pdf-viewer-override.css';

const PdfViewer = ({ url, fileName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef(null);

  // Force loading to complete after a timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Handle direct download
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

  // Calculate modal width based on screen size
  const screenWidth = window.innerWidth;
  let modalWidth;

  if (screenWidth <= 320) {
    modalWidth = screenWidth * 0.6; // 60% of screen width for very small screens
  } else if (screenWidth <= 768) {
    modalWidth = Math.min(screenWidth * 0.8, 600); // 80% of screen width for mobile, max 600px
  } else {
    modalWidth = Math.min(screenWidth * 0.5, 800); // 50% of screen width for larger screens, max 800px
  }

  return (
    <>
      <style>
        {`
          .pdf-container-override {
            width: 95% !important;
            max-width: 1200px !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            margin: 0 auto !important;
            height: 600px !important;
            padding: 15px !important;
            background-color: #ffffff !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }
          .pdf-iframe-override {
            transform: scale(1.0) !important;
            width: 100% !important;
            height: 100% !important;
            border: none !important;
            border-radius: 4px !important;
          }

          @media (max-width: 320px) {
            .pdf-container-override {
              width: 100% !important;
              height: 550px !important;
              padding: 10px !important;
              overflow-y: auto !important;
              overflow-x: hidden !important;
            }
            .pdf-iframe-override {
              transform: scale(1.1) !important;
              transform-origin: center top !important;
            }
          }
        `}
      </style>
      <div className="pdf-container pdf-container-override" style={{
      width: modalWidth + 'px',
      maxWidth: '95%',
      boxSizing: 'border-box',
      overflow: 'hidden',
      margin: '0 auto',
      height: '600px',
      padding: '15px',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    }}>
      {isLoading && (
        <div className="pdf-loading" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 100
        }}>
          <Loader size="lg" content="Loading PDF..." vertical style={{ fontSize: '18px' }} />
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={url}
        width="100%"
        height="100%"
        className="pdf-viewer pdf-iframe-override"
        style={{
          display: isLoading ? 'none' : 'block',
          border: 'none',
          position: 'relative',
          top: 0,
          left: 0,
          marginTop: '0',
          width: '100%',
          height: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflowX: 'hidden',
          margin: '0 auto',
          transform: 'scale(1.0)',
          transformOrigin: 'center top',
          borderRadius: '4px'
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        title={fileName}
        frameBorder="0"
        scrolling="yes"
        allowFullScreen
      />

      {hasError && (
        <div className="pdf-error" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          padding: '30px',
          zIndex: 50,
          textAlign: 'center'
        }}>
          <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '80px', color: '#e53e3e', marginBottom: '25px' }} />
          <p style={{ fontSize: '20px', marginBottom: '20px', fontWeight: 'bold' }}>Could not load PDF preview</p>
          <Button
            appearance="primary"
            onClick={handleDownload}
            style={{
              marginTop: '25px',
              fontSize: '18px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600'
            }}
          >
            <FontAwesomeIcon icon={faDownload} style={{ marginRight: '12px' }} />
            Download PDF
          </Button>
        </div>
      )}
    </div>
    </>
  );
};

export default PdfViewer;
