import React from 'react';

const PdfIcon = ({ size = '80px' }) => {
  return (
    <div className="pdf-icon-container">
      <div
        className="pdf-icon-box"
        style={{
          width: size,
          height: size
        }}
      >
        <div className="pdf-icon-corner"></div>
        <div className="pdf-icon-text">PDF</div>
      </div>
    </div>
  );
};

export default PdfIcon;
