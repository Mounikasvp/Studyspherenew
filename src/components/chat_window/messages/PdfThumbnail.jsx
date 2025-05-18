import React from 'react';
import PdfIcon from './PdfIcon';

const PdfThumbnail = () => {
  return (
    <div className="pdf-thumbnail-container">
      <PdfIcon size="80px" />
      <p className="pdf-preview-unavailable">Preview not available</p>
    </div>
  );
};

export default PdfThumbnail;
