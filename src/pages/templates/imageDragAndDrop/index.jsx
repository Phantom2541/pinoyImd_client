import { useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBIcon,
  MDBBtnGroup,
} from "mdbreact";
import logo from "../../../assets/iMD.png";

const ImageDragAndDrop = () => {
  const [preview, setPreview] = useState(logo);
  const [previousImage, setPreviousImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [showIcons, setShowIcons] = useState(false);

  console.log("dragCounter", dragCounter);

  const handleFiles = (files) => {
    const file = files[0];
    if (file && file.type.startsWith("image/")) {
      setPreviousImage(preview);
      setPreview(URL.createObjectURL(file));
      setShowIcons(true);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragCounter(0);
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragCounter((prev) => prev + 1);
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragCounter((prev) => {
      const next = prev - 1;
      if (next === 0) setIsDragging(false);
      return next;
    });
  };

  const handleFileInputChange = (e) => {
    handleFiles(e.target.files);
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = preview;
    link.download = "image.png";
    link.click();
  };

  const handleRevert = () => {
    if (previousImage) {
      setPreview(previousImage);
      setShowIcons(false);
    }
  };

  const handleUpload = () => {};

  return (
    <MDBCard
      className="text-center p-3"
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      <MDBCardBody>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{
            position: "relative",
            display: "inline-block",
            width: "100%",
            maxHeight: "250px",
            borderRadius: "8px",
            overflow: "hidden",
            border: "2px dashed",
            borderColor: isDragging ? "#00bcd4" : "transparent",
            backgroundColor: isDragging ? "#e0f7fa" : "#f8f9fa",
            boxShadow: isDragging ? "0 0 15px rgba(0, 188, 212, 0.5)" : "none",
            transition: "0.3s ease",
          }}
        >
          <MDBCardImage
            src={preview}
            alt="Preview"
            top
            style={{
              width: "100%",
              maxHeight: "250px",
              objectFit: "contain",
              filter:
                isDragging || isHovering
                  ? "blur(2px) brightness(0.95)"
                  : "none",
              transition: "0.3s ease",
            }}
          />

          {isDragging && (
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.4rem",
                fontWeight: "bold",
                color: "#00bcd4",
                textShadow: "1px 1px 2px white",
              }}
            >
              Drop your image here 💡
            </div>
          )}

          {isHovering && !isDragging && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                gap: "10px",
              }}
            >
              <label htmlFor="fileInput">
                <MDBBtnGroup>
                  <MDBBtn
                    color="info"
                    size="sm"
                    rounded
                    onClick={() => document.getElementById("fileInput").click()}
                  >
                    <MDBIcon icon="upload" />
                  </MDBBtn>
                  <MDBBtn
                    color="success"
                    size="sm"
                    rounded
                    onClick={downloadImage}
                  >
                    <MDBIcon icon="download" />
                  </MDBBtn>
                </MDBBtnGroup>
              </label>
            </div>
          )}

          {showIcons && (
            <div
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                display: "flex",
                gap: "8px",
              }}
            >
              <div
                title="Save change"
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
                onClick={handleUpload}
                className="cursor-pointer"
              >
                <MDBIcon icon="check" />
              </div>
              <div
                title="Cancel"
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
                onClick={handleRevert}
              >
                <MDBIcon icon="times" />
              </div>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          id="fileInput"
          style={{ display: "none" }}
        />
      </MDBCardBody>
    </MDBCard>
  );
};

export default ImageDragAndDrop;
