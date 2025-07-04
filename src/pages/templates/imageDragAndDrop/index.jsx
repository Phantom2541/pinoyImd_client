import { useRef, useState } from "react";
import "./style.css";
import { MDBIcon } from "mdbreact";
import logo from "../../../assets/iMD.png";

const ImageDragAndDrop = () => {
  const [preview, setPreview] = useState(logo);
  const [isDefault, setIsDefault] = useState(true);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setIsDefault(false);
        setIsAccepted(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDragEnter = () => {
    setIsDraggingOver(true);
    setIsAccepted(false); // Reset accept state when dragging new image
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDraggingOver(false);
    }
  };

  const handleClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setIsDefault(false);
        setIsAccepted(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(logo);
    setIsDefault(true);
    setIsAccepted(false);
  };

  const handleAccept = () => {
    setIsAccepted(true);
  };

  const handleUpload = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  return (
    <div className="template-dragNdrop-container">
      <div
        className={`template-dragNdrop-dropImgArea
          ${isDraggingOver ? "show-border" : ""}
          ${isAccepted ? "accepted" : ""}
          ${isDefault ? "default" : ""}
        `}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <img
          src={preview}
          alt="preview"
          className={isDraggingOver ? "dragging-preview" : "normal-preview"}
        />

        {isDraggingOver && (
          <span
            className="drop-text"
            style={{ opacity: isDraggingOver ? 1 : 0 }}
          >
            Drop image here
          </span>
        )}

        <input
          type="file"
          hidden
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Accept/Remove icons */}
        {!isDefault && !isAccepted && (
          <div className="icon-actions">
            <MDBIcon
              icon="times-circle"
              size="2x"
              className="icon-remove"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
            />
            <MDBIcon
              icon="check-circle"
              size="2x"
              className="icon-accept"
              onClick={(e) => {
                e.stopPropagation();
                handleAccept();
              }}
            />
          </div>
        )}

        {/* Show download/upload buttons if accepted OR still default */}
        {(isAccepted || isDefault) && (
          <div className="hover-buttons">
            <a
              href={preview}
              download="my-image.png"
              className="download-button"
              onClick={(e) => e.stopPropagation()}
            >
              <MDBIcon icon="download" /> Download
            </a>
            <button className="upload-button" onClick={handleUpload}>
              <MDBIcon icon="upload" /> Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageDragAndDrop;
