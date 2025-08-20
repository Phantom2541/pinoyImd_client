import React, { useState } from "react";
import "./../style.css";
import { MDBIcon } from "mdbreact";
import { Students } from "./../collections";

export default function Modal({
  isOpen,
  setIsOpen,
  setFrontImage,
  setBackImage,
  positions,
  setPositions,
}) {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  // Calibration state
  const [calibrateField, setCalibrateField] = useState(null); // Name, ID Number, etc.

  // Handle file upload with dynamic setter
  const handleUpload = (event, setImage) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  // Save images
  const handleSave = () => {
    setFrontImage(image1);
    setBackImage(image2);
    setIsOpen(false);
  };

  // Handle click on image to set position
  const handleImageClick = (e, imageSide) => {
    if (!calibrateField) return;

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPositions = {};
    calibrateField.keys.forEach((key) => {
      newPositions[key] = { x, y, side: imageSide }; // add side info
    });

    setPositions((prev) => ({
      ...prev,
      ...newPositions,
    }));

    setCalibrateField(null);
  };

  // I-map yung fields sa buttons
  const idFields = [
    { label: "Name", keys: ["fullName"] }, // combine first + last
    { label: "ID Number", keys: ["studentNumber"] },
    { label: "Section", keys: ["section"] },
    { label: "Course", keys: ["course"] },
    { label: "Position", keys: ["position"] },
  ];

  return (
    <div className={`IDGenerator-modal ${isOpen ? "active" : ""}`}>
      <div className="IDGenerator-modal-content">
        <div className="IDGenerator-modal-header">
          <span>Upload ID Template</span>
          <button onClick={() => setIsOpen(false)}>
            <MDBIcon fas icon="times" />
          </button>
        </div>

        <div className="IDGenerator-modal-body">
          <div className="d-flex align-items-start" style={{ gap: "20px" }}>
            {/* First Upload */}
            <div className="IDGenerator-modal-IdUpload-container">
              <input
                id="idUploadInput1"
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, setImage1)}
                hidden
              />
              <div className="IDGenerator-modal-preview-container">
                {!image1 ? (
                  <label
                    htmlFor="idUploadInput1"
                    className="IDGenerator-modal-idUpload-addBtn"
                  >
                    <MDBIcon fas icon="plus" />
                  </label>
                ) : (
                  <img
                    src={image1}
                    alt="Uploaded preview 1"
                    className="IDGenerator-preview-img"
                    onClick={(e) => handleImageClick(e, "front")}
                    style={{ cursor: calibrateField ? "crosshair" : "default" }}
                  />
                )}
              </div>
            </div>

            {/* Second Upload */}
            <div className="IDGenerator-modal-IdUpload-container">
              <input
                id="idUploadInput2"
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, setImage2)}
                hidden
              />
              <div className="IDGenerator-modal-preview-container">
                {!image2 ? (
                  <label
                    htmlFor="idUploadInput2"
                    className="IDGenerator-modal-idUpload-addBtn"
                  >
                    <MDBIcon fas icon="plus" />
                  </label>
                ) : (
                  <img
                    src={image2}
                    alt="Uploaded preview 2"
                    className="IDGenerator-preview-img"
                    onClick={(e) => handleImageClick(e, "back")}
                    style={{ cursor: calibrateField ? "crosshair" : "default" }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Calibration Buttons */}
          <div className="IDGenerator-modal-template-calibrate">
            <div className="IDGenerator-modal-template-calibrate-buttons">
              {idFields.map((field) => (
                <button
                  key={field.label}
                  onClick={() => setCalibrateField(field)}
                  style={{
                    backgroundColor:
                      calibrateField?.label === field.label ? "#007bff" : "",
                  }}
                >
                  {field.label}
                </button>
              ))}
            </div>
          </div>

          {/* Show positions */}
          <pre>{JSON.stringify(positions, null, 2)}</pre>
        </div>

        <div className="IDGenerator-modal-footer">
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}
