import React, { useState, useEffect } from "react";
import "./../style.css";
import { MDBBtn, MDBIcon } from "mdbreact";
import { fakeData } from "./fakeDB";

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
  const [calibrateField, setCalibrateField] = useState(null);
  const [placedFields, setPlacedFields] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const startDrag = (e, label, side) => {
    e.stopPropagation();
    const index = placedFields.findIndex(
      (f) => f.label === label && f.side === side
    );
    if (index === -1) return;
    setDragIndex(index);

    const f = placedFields[index];
    setDragOffset({ x: e.clientX - f.x, y: e.clientY - f.y });
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (dragIndex === null) return;

      setPlacedFields((prev) => {
        const newFields = [...prev];
        const f = newFields[dragIndex];

        // Get the parent image container
        const container = document.querySelector(
          f.side === "front"
            ? ".IDGenerator-modal-preview-container img[src='" + image1 + "']"
            : ".IDGenerator-modal-preview-container img[src='" + image2 + "']"
        );
        if (!container) return newFields;

        const rect = container.getBoundingClientRect();

        // Get the div representing the dragged field
        const div = document.getElementById(`field-${dragIndex}`);
        const divRect = div
          ? div.getBoundingClientRect()
          : { width: 0, height: 0 };

        // Clamp x and y inside image, accounting for div size
        const newX = Math.min(
          Math.max(e.clientX - dragOffset.x, divRect.width / 2),
          rect.width - divRect.width / 2
        );
        const newY = Math.min(
          Math.max(e.clientY - dragOffset.y, divRect.height / 2),
          rect.height - divRect.height / 2
        );

        newFields[dragIndex] = { ...f, x: newX, y: newY };

        return newFields;
      });
    };

    const handleUp = () => setDragIndex(null);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [dragIndex, dragOffset, image1, image2]);

  // Generate dynamic fields from fakeData[0]
  const generateFields = (obj, prefix = "") => {
    let fields = [];
    Object.keys(obj).forEach((key) => {
      if (
        (key === "fullName" || key === "address") &&
        typeof obj[key] === "object"
      ) {
        fields.push({
          label: key === "fullName" ? "Full Name" : "Address",
          keys: [`${prefix}${key}`],
        });
        if (key === "fullName" && obj[key].postnominal) {
          fields.push({
            label: "Postnominal",
            keys: [`${prefix}${key}.postnominal`],
          });
        }
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        fields = [...fields, ...generateFields(obj[key], `${prefix}${key}.`)];
      } else {
        fields.push({
          label: key.charAt(0).toUpperCase() + key.slice(1),
          keys: [`${prefix}${key}`],
        });
      }
    });
    return fields;
  };

  const idFields = generateFields(fakeData[0]);

  // Cursor effect
  useEffect(() => {
    const handleMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    if (calibrateField) {
      window.addEventListener("mousemove", handleMove);
    }
    return () => window.removeEventListener("mousemove", handleMove);
  }, [calibrateField]);

  // Upload handler
  const handleUpload = (event, setImage) => {
    const file = event.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  // Save handler
  const handleSave = () => {
    if (!image1 || !image2) {
      alert("Please upload both Front and Back ID templates.");
      return;
    }
    setFrontImage(image1);
    setBackImage(image2);
    setIsOpen(false);
  };

  // Place field value on image
  const handleImageClick = (e, imageSide) => {
    if (!calibrateField) return;

    // Check if field is already placed on the other side
    const existing = placedFields.find(
      (f) => f.label === calibrateField.label && f.side !== imageSide
    );
    if (existing) {
      alert(
        `Field "${calibrateField.label}" is already placed on the ${existing.side}. Remove it first.`
      );
      setCalibrateField(null);
      return;
    }

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const value = getFieldValue(calibrateField.keys[0]);

    setPlacedFields((prev) => [
      ...prev,
      { x, y, side: imageSide, label: calibrateField.label, value },
    ]);

    setCalibrateField(null);
  };

  const getFieldValue = (keyPath) => {
    const keys = keyPath.split(".");
    let val = fakeData[0];
    keys.forEach((k) => {
      val = val?.[k] ?? "";
    });

    // Handle objects
    if (typeof val === "object" && val !== null) {
      if (keys[0] === "fullName") {
        const { postnominal, ...nameParts } = val;

        const ordered = [];
        if (nameParts.title) ordered.push(nameParts.title);
        if (nameParts.fname) ordered.push(nameParts.fname);
        if (nameParts.mname) ordered.push(nameParts.mname);
        if (nameParts.lname) ordered.push(nameParts.lname);
        if (nameParts.suffix) ordered.push(nameParts.suffix);

        return ordered.join(" ");
      }

      // Other objects like address
      return Object.values(val)
        .map((v) => (typeof v === "object" && v !== null ? "" : v))
        .filter(Boolean)
        .join(" ");
    }

    return val;
  };

  const handleSelectField = (field) => {
    // Check if field is already placed
    const isAlreadyPlaced = placedFields.some((f) => f.label === field.label);

    if (isAlreadyPlaced) {
      // Alisin sa placedFields kung kinlick ulit
      setPlacedFields((prev) => prev.filter((f) => f.label !== field.label));
      // Also deselect if it was the current calibration field
      if (calibrateField?.label === field.label) {
        setCalibrateField(null);
      }
    } else {
      // Otherwise, enter calibration mode
      setCalibrateField(field);
    }
  };

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
            {/* FRONT */}
            <div
              className="IDGenerator-modal-IdUpload-container"
              style={{ position: "relative" }}
            >
              <span className="IDGenerator-modal-idUpload-title">Front</span>
              <input
                id="idUploadInput1"
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, setImage1)}
                hidden
              />
              <div
                className="IDGenerator-modal-preview-container"
                style={{ position: "relative" }}
                onClick={(e) => handleImageClick(e, "front")}
              >
                {!image1 ? (
                  <label
                    htmlFor="idUploadInput1"
                    className="IDGenerator-modal-idUpload-addBtn"
                  >
                    <MDBIcon fas icon="plus" />
                  </label>
                ) : (
                  <>
                    <img
                      src={image1}
                      alt="Front"
                      className="IDGenerator-preview-img"
                    />
                    {placedFields
                      .filter((f) => f.side === "front")
                      .map((f, i) => (
                        <div
                          id={`field-${i}`}
                          key={f.label + "_front"}
                          style={{
                            position: "absolute",
                            left: f.x,
                            top: f.y,
                            transform: "translate(-50%, -50%)",
                            color: "#000",
                            zIndex: 20,
                            fontSize: "16px",
                            cursor: "move",
                            whiteSpace: "nowrap",
                          }}
                          onMouseDown={(e) => startDrag(e, f.label, "front")}
                        >
                          {f.value}
                        </div>
                      ))}
                  </>
                )}
              </div>
            </div>

            {/* BACK */}
            <div
              className="IDGenerator-modal-IdUpload-container"
              style={{ position: "relative" }}
            >
              <span className="IDGenerator-modal-idUpload-title">Back</span>
              <input
                id="idUploadInput2"
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, setImage2)}
                hidden
              />
              <div
                className="IDGenerator-modal-preview-container"
                style={{ position: "relative" }}
                onClick={(e) => handleImageClick(e, "back")}
              >
                {!image2 ? (
                  <label
                    htmlFor="idUploadInput2"
                    className="IDGenerator-modal-idUpload-addBtn"
                  >
                    <MDBIcon fas icon="plus" />
                  </label>
                ) : (
                  <>
                    <img
                      src={image2}
                      alt="Back"
                      className="IDGenerator-preview-img"
                    />
                    {placedFields
                      .filter((f) => f.side === "back")
                      .map((f, i) => (
                        <div
                          id={`field-${i}`}
                          key={f.label + "_back"}
                          style={{
                            position: "absolute",
                            left: f.x,
                            top: f.y,
                            transform: "translate(-50%, -50%)",
                            color: "#000",
                            zIndex: 20,
                            fontSize: "16px",
                            cursor: "move",
                            whiteSpace: "nowrap",
                          }}
                          onMouseDown={(e) => startDrag(e, f.label, "back")}
                        >
                          {f.value}
                        </div>
                      ))}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* calibration buttons */}
          <div className="IDGenerator-modal-template-calibrate">
            <div
              style={{
                background: "#f8f9fa",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "12px",
                marginBottom: "15px",
                fontSize: "14px",
                color: "#333",
                lineHeight: "1.4",
              }}
            >
              <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>
                How to set up your ID template:
              </p>
              <ol style={{ margin: 0, paddingLeft: "18px" }}>
                <li>
                  Upload the <strong>Front</strong> and <strong>Back</strong> ID
                  images.
                </li>
                <li>Click a field name to enter calibration mode.</li>
                <li>
                  Click on the image where that field should appear; the value
                  will follow your cursor.
                </li>
                <li>Repeat for all fields you want to place.</li>
                <li>
                  Click <strong>Save</strong> when done.
                </li>
              </ol>
            </div>

            <div className="IDGenerator-modal-template-calibrate-buttons">
              {idFields.map((field) => {
                const isSelected = calibrateField?.label === field.label;
                const isPlaced = placedFields.some(
                  (f) => f.label === field.label
                );

                // Kunin ang current value ng field
                const fieldValue = getFieldValue(field.keys[0]);

                return (
                  <div key={field.label} style={{ marginBottom: "5px" }}>
                    <label>{field.label}:</label>
                    <button
                      onClick={() => handleSelectField(field)}
                      style={{
                        backgroundColor: isSelected || isPlaced ? "#000" : "",
                        color: isSelected || isPlaced ? "white" : "",
                        border: `1px solid #000`,
                        padding: "4px 8px",
                      }}
                      disabled={!image1 || !image2}
                    >
                      {fieldValue || field.label}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="IDGenerator-modal-footer">
          <MDBBtn color="primary" size="md" onClick={handleSave}>
            Save
          </MDBBtn>
        </div>
      </div>

      {/* custom cursor showing field value */}
      {calibrateField && (
        <div
          style={{
            position: "fixed",
            left: mousePos.x,
            top: mousePos.y,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            color: "#000",
            fontSize: "16px",
            zIndex: 9999,
          }}
        >
          {getFieldValue(calibrateField.keys[0])}
        </div>
      )}
    </div>
  );
}
