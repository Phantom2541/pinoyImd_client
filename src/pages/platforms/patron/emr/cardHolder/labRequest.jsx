import React, { useRef, useState } from "react";
import { MDBCard, MDBCardBody, MDBBtn, MDBIcon } from "mdbreact";

const LabRequest = () => {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <MDBCard
        style={{
          width: "794px",
          height: "400px",
          borderRadius: "8px",
          position: "relative",
          backgroundColor: "#f9f9f9",
          overflow: "hidden",
        }}
      >
        <MDBCardBody
          className="p-0"
          style={{ height: "100%", position: "relative" }}
        >
          {image ? (
            <>
              <div
                style={{
                  height: "100%",
                  overflowY: "auto",
                  padding: "10px",
                }}
              >
                <img
                  src={image}
                  alt="Uploaded Lab Request"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: "-5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <MDBBtn size="sm" color="warning" onClick={handleUploadClick}>
                  <MDBIcon icon="redo" className="mr-2" />
                  Change Image
                </MDBBtn>
              </div>
            </>
          ) : (
            <div className="d-flex h-100 w-100 align-items-center justify-content-center">
              <MDBBtn size="md" color="warning" onClick={handleUploadClick}>
                <MDBIcon icon="upload" className="mr-2" />
                Upload Lab Request Form
              </MDBBtn>
            </div>
          )}
        </MDBCardBody>

        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </MDBCard>
    </div>
  );
};

export default LabRequest;
