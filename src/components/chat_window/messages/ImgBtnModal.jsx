import React from "react";

const ImgBtnModal = ({ src, fileName }) => {
  return (
    <div className="image-container">
      <img
        src={src}
        alt={fileName}
        className="mw-100 mh-100 w-auto"
        style={{
          background: 'transparent',
          border: 'none',
          padding: '0',
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          borderRadius: '12px'
        }}
      />
    </div>
  );
};

export default ImgBtnModal;
