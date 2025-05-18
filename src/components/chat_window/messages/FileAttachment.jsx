import React, { useState } from 'react';
import { Button, Loader } from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFileVideo,
  faFileAudio,
  faFileArchive,
  faFileCode,
  faFileAlt,
  faFile,
  faDownload
} from '@fortawesome/free-solid-svg-icons';
import '../../../styles/file-attachment.css';

// Helper function to get appropriate icon based on file type
const getFileIcon = (contentType) => {
  if (contentType.includes('pdf')) return faFilePdf;
  if (contentType.includes('word') || contentType.includes('msword') || contentType.includes('document')) return faFileWord;
  if (contentType.includes('excel') || contentType.includes('spreadsheet')) return faFileExcel;
  if (contentType.includes('powerpoint') || contentType.includes('presentation')) return faFilePowerpoint;
  if (contentType.includes('video')) return faFileVideo;
  if (contentType.includes('audio')) return faFileAudio;
  if (contentType.includes('zip') || contentType.includes('rar') || contentType.includes('tar') || contentType.includes('compressed')) return faFileArchive;
  if (contentType.includes('code') || contentType.includes('javascript') || contentType.includes('css') || contentType.includes('html') || contentType.includes('json')) return faFileCode;
  if (contentType.includes('text')) return faFileAlt;
  return faFile; // Default file icon
};

// Helper function to get color based on file type
const getFileColor = (contentType) => {
  if (contentType.includes('pdf')) return '#e53e3e'; // Red
  if (contentType.includes('word') || contentType.includes('msword') || contentType.includes('document')) return '#3182ce'; // Blue
  if (contentType.includes('excel') || contentType.includes('spreadsheet')) return '#38a169'; // Green
  if (contentType.includes('powerpoint') || contentType.includes('presentation')) return '#dd6b20'; // Orange
  if (contentType.includes('video')) return '#805ad5'; // Purple
  if (contentType.includes('audio')) return '#d53f8c'; // Pink
  if (contentType.includes('zip') || contentType.includes('rar') || contentType.includes('tar') || contentType.includes('compressed')) return '#718096'; // Gray
  if (contentType.includes('code') || contentType.includes('javascript') || contentType.includes('css') || contentType.includes('html') || contentType.includes('json')) return '#2c5282'; // Dark Blue
  if (contentType.includes('text')) return '#4a5568'; // Dark Gray
  return '#4a5568'; // Default color
};

// Helper function to get file extension from name or content type
const getFileExtension = (fileName, contentType) => {
  // Try to get extension from file name
  const fileNameParts = fileName.split('.');
  if (fileNameParts.length > 1) {
    return fileNameParts[fileNameParts.length - 1].toUpperCase();
  }

  // If no extension in filename, try to derive from content type
  if (contentType.includes('pdf')) return 'PDF';
  if (contentType.includes('word') || contentType.includes('msword')) return 'DOC';
  if (contentType.includes('document')) return 'DOCX';
  if (contentType.includes('excel') || contentType.includes('spreadsheet')) return 'XLS';
  if (contentType.includes('powerpoint') || contentType.includes('presentation')) return 'PPT';
  if (contentType.includes('video')) {
    if (contentType.includes('mp4')) return 'MP4';
    if (contentType.includes('avi')) return 'AVI';
    if (contentType.includes('mov')) return 'MOV';
    return 'VIDEO';
  }
  if (contentType.includes('audio')) {
    if (contentType.includes('mp3')) return 'MP3';
    if (contentType.includes('wav')) return 'WAV';
    return 'AUDIO';
  }
  if (contentType.includes('zip')) return 'ZIP';
  if (contentType.includes('rar')) return 'RAR';
  if (contentType.includes('tar')) return 'TAR';
  if (contentType.includes('compressed')) return 'ZIP';
  if (contentType.includes('text')) return 'TXT';

  // Default to generic file
  return 'FILE';
};

const FileAttachment = ({ file }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const icon = getFileIcon(file.contentType);
  const color = getFileColor(file.contentType);
  const fileExt = getFileExtension(file.name, file.contentType);

  // Function to download the file
  const handleDownload = () => {
    setIsDownloading(true);

    try {
      // Create an anchor element
      const link = document.createElement('a');

      // Set the href to the file URL
      link.href = file.url;

      // Set the download attribute with the file name
      link.download = file.name;

      // Append the link to the body
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      document.body.removeChild(link);
      setIsDownloading(false);
    } catch (error) {
      console.error('Error downloading file:', error);
      setIsDownloading(false);
    }
  };

  return (
    <div className="file-attachment">
      <div
        className="file-icon"
        style={{ color: color }}
      >
        <FontAwesomeIcon icon={icon} />
      </div>

      <div className="file-info">
        <div className="file-name">
          {file.name}
        </div>
        <div className="file-details">
          <span className="file-type">{fileExt}</span>
        </div>
      </div>

      <Button
        appearance="link"
        className="download-btn"
        onClick={handleDownload}
      >
        {isDownloading ? <Loader size="xs" /> : <FontAwesomeIcon icon={faDownload} />}
      </Button>
    </div>
  );
};

export default FileAttachment;
