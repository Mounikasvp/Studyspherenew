import React, { useState, useEffect } from 'react';
import { Button, Loader } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileImage,
  faFileVideo,
  faFileAudio,
  faFileArchive,
  faFileCode,
  faFileAlt,
  faFile,
  faDownload,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import '../../../styles/file-viewer.css';

// Helper function to get appropriate icon based on file type
const getFileIcon = (fileType) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return faFilePdf;
    case 'docx':
    case 'doc':
      return faFileWord;
    case 'xlsx':
    case 'xls':
      return faFileExcel;
    case 'pptx':
    case 'ppt':
      return faFilePowerpoint;
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'bmp':
      return faFileImage;
    case 'mp4':
    case 'webm':
    case 'avi':
    case 'mov':
      return faFileVideo;
    case 'mp3':
    case 'wav':
    case 'ogg':
      return faFileAudio;
    case 'zip':
    case 'rar':
    case 'tar':
    case '7z':
      return faFileArchive;
    case 'js':
    case 'html':
    case 'css':
    case 'json':
    case 'xml':
      return faFileCode;
    case 'txt':
    case 'csv':
      return faFileAlt;
    default:
      return faFile;
  }
};

// Helper function to get color based on file type
const getFileColor = (fileType) => {
  switch (fileType.toLowerCase()) {
    case 'pdf':
      return '#e53e3e'; // Red
    case 'docx':
    case 'doc':
      return '#3182ce'; // Blue
    case 'xlsx':
    case 'xls':
      return '#38a169'; // Green
    case 'pptx':
    case 'ppt':
      return '#dd6b20'; // Orange
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'bmp':
      return '#805ad5'; // Purple
    case 'mp4':
    case 'webm':
    case 'avi':
    case 'mov':
      return '#d53f8c'; // Pink
    case 'mp3':
    case 'wav':
    case 'ogg':
      return '#d53f8c'; // Pink
    case 'zip':
    case 'rar':
    case 'tar':
    case '7z':
      return '#718096'; // Gray
    case 'js':
    case 'html':
    case 'css':
    case 'json':
    case 'xml':
      return '#2c5282'; // Dark Blue
    case 'txt':
    case 'csv':
      return '#4a5568'; // Dark Gray
    default:
      return '#a0aec0'; // Light Gray
  }
};

const AdvancedFileViewer = ({ url, fileName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    // Extract file extension from fileName
    const extension = fileName.split('.').pop().toLowerCase();
    setFileType(extension);

    // Set a timeout to hide the loader after a reasonable time
    // even if the onLoad event doesn't fire
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [fileName]);

  // Function to open in new tab
  const openInNewTab = () => {
    window.open(url, '_blank');
  };

  // Function to download the file
  const handleDownload = () => {
    try {
      // Create an anchor element
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Get icon and color based on file type
  const icon = getFileIcon(fileType);
  const color = getFileColor(fileType);

  return (
    <div className="advanced-file-viewer">
      {isLoading && (
        <div className="file-loading">
          <Loader size="md" content="Loading file..." vertical />
        </div>
      )}

      <div className="file-preview-container">
        <div className="file-icon-container">
          <FontAwesomeIcon icon={icon} style={{ fontSize: '48px', color: color, marginBottom: '15px' }} />
          <p>{fileName}</p>
        </div>

        <div className="file-actions">
          <Button
            appearance="primary"
            onClick={openInNewTab}
            style={{ marginRight: '10px' }}
          >
            <FontAwesomeIcon icon={faExternalLinkAlt} style={{ marginRight: '8px' }} />
            Open in Browser
          </Button>

          <Button
            appearance="primary"
            onClick={handleDownload}
          >
            <FontAwesomeIcon icon={faDownload} style={{ marginRight: '8px' }} />
            Download File
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFileViewer;
