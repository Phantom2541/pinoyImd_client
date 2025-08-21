import React, { useState, useEffect } from "react";
import "./../style.css";
import { MDBBtn, MDBIcon } from "mdbreact";
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
  const [calibrateField, setCalibrateField] = useState(null);
  const [crosshairs, setCrosshairs] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [fieldColors, setFieldColors] = useState({});

  // --------- Generate dynamic fields from Students dataset ---------
  const generateFields = (obj, prefix = "") => {
    let fields = [];
    Object.keys(obj).forEach((key) => {
      if (key === "fullName" && typeof obj[key] === "object") {
        // special case: fullName (fname, mname, lname, suffix)
        fields.push({
          label: "fullName",
          keys: ["fullName"], // isang key lang para buo siya
        });

        // separate button for postnominal
        fields.push({
          label: "postnominal",
          keys: ["postnominal"],
        });
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        // recursive scan for other nested objects (if any)
        fields = [...fields, ...generateFields(obj[key], `${prefix}${key}.`)];
      } else {
        // skip fname, lname, mname, suffix, postnominal dahil na-handle na sila
        if (!prefix.startsWith("fullName.")) {
          fields.push({ label: `${prefix}${key}`, keys: [`${prefix}${key}`] });
        }
      }
    });
    return fields;
  };

  // kunin first student as schema
  const idFields = generateFields(Students[0]);

  // --------- Cursor effect ---------
  useEffect(() => {
    const handleMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    if (calibrateField) {
      window.addEventListener("mousemove", handleMove);
    }
    return () => window.removeEventListener("mousemove", handleMove);
  }, [calibrateField]);

  // --------- Upload ---------
  const handleUpload = (event, setImage) => {
    const file = event.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  // --------- Save ---------
  const handleSave = () => {
    if (!image1 || !image2) {
      alert("Please upload both Front and Back ID templates.");
      return;
    }
    if (crosshairs.length === 0) {
      alert("Please calibrate at least one field before saving.");
      return;
    }
    setFrontImage(image1);
    setBackImage(image2);
    setIsOpen(false);
  };

  // --------- Place crosshair ---------
  const handleImageClick = (e, imageSide) => {
    if (!calibrateField) return;

    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPositions = {};
    calibrateField.keys.forEach((key) => {
      newPositions[key] = { x, y, side: imageSide };
    });

    setPositions((prev) => ({ ...prev, ...newPositions }));

    setCrosshairs((prev) => {
      const filtered = prev.filter((c) => c.label !== calibrateField.label);
      return [
        ...filtered,
        {
          x,
          y,
          side: imageSide,
          label: calibrateField.label,
          color: fieldColors[calibrateField.label],
        },
      ];
    });

    setCalibrateField(null); // exit calibration mode
  };

  // --------- Drag crosshair ---------
  const handleMouseDown = (e, index) => {
    e.stopPropagation();
    setDragging(index);
  };

  const handleMouseMove = (e, imageSide) => {
    if (dragging === null) return;

    const rect = e.target
      .closest(".IDGenerator-modal-preview-container")
      .getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCrosshairs((prev) => {
      const updated = [...prev];
      updated[dragging] = { ...updated[dragging], x, y };
      return updated;
    });
  };

  const handleMouseUp = () => {
    if (dragging !== null) {
      const c = crosshairs[dragging];
      if (c) {
        const newPositions = {};
        const field = idFields.find((f) => f.label === c.label);
        field?.keys.forEach((key) => {
          newPositions[key] = { x: c.x, y: c.y, side: c.side };
        });
        setPositions((prev) => ({ ...prev, ...newPositions }));
      }
    }
    setDragging(null);
  };

  // --------- Colors ---------
  const getRandomColor = () =>
    "#" + Math.floor(Math.random() * 16777215).toString(16);

  const handleSelectField = (field) => {
    const hasCrosshair = crosshairs.some((c) => c.label === field.label);

    if (hasCrosshair) {
      setCrosshairs((prev) => prev.filter((c) => c.label !== field.label));
      setPositions((prev) => {
        const newPos = { ...prev };
        field.keys.forEach((k) => delete newPos[k]);
        return newPos;
      });
      return;
    }

    if (!fieldColors[field.label]) {
      setFieldColors((prev) => ({ ...prev, [field.label]: getRandomColor() }));
    }
    setCalibrateField(field);
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
                onMouseMove={(e) => handleMouseMove(e, "front")}
                onMouseUp={handleMouseUp}
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
                      alt="Uploaded preview 1"
                      className="IDGenerator-preview-img"
                      onClick={(e) => handleImageClick(e, "front")}
                    />
                    {crosshairs
                      .filter((c) => c.side === "front")
                      .map((c, i) => (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            left: c.x,
                            top: c.y,
                            transform: "translate(-50%, -50%)",
                            color: c.color,
                            zIndex: 20,
                            fontSize: "20px",
                            cursor: "move",
                          }}
                          onMouseDown={(e) => handleMouseDown(e, i)}
                        >
                          <MDBIcon fas icon="crosshairs" />
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
                onMouseMove={(e) => handleMouseMove(e, "back")}
                onMouseUp={handleMouseUp}
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
                      alt="Uploaded preview 2"
                      className="IDGenerator-preview-img"
                      onClick={(e) => handleImageClick(e, "back")}
                    />
                    {crosshairs
                      .filter((c) => c.side === "back")
                      .map((c, i) => (
                        <div
                          key={i}
                          style={{
                            position: "absolute",
                            left: c.x,
                            top: c.y,
                            transform: "translate(-50%, -50%)",
                            color: c.color,
                            zIndex: 20,
                            fontSize: "20px",
                            cursor: "move",
                          }}
                          onMouseDown={(e) => handleMouseDown(e, i)}
                        >
                          <MDBIcon fas icon="crosshairs" />
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
                  Place the <MDBIcon fas icon="crosshairs" /> crosshair where
                  that field should appear.
                </li>
                <li>Repeat for all fields you want to calibrate.</li>
                <li>
                  Click <strong>Save</strong> when done.
                </li>
              </ol>
            </div>

            <div className="IDGenerator-modal-template-calibrate-buttons">
              {idFields.map((field) => {
                const color = fieldColors[field.label] || "#ccc";
                const isSelected = calibrateField?.label === field.label;
                const isCalibrated = crosshairs.some(
                  (c) => c.label === field.label
                );

                return (
                  <button
                    key={field.label}
                    onClick={() => handleSelectField(field)}
                    style={{
                      backgroundColor: isSelected || isCalibrated ? color : "",
                      color: isSelected || isCalibrated ? "white" : "",
                      border: `1px solid ${color}`,
                      marginRight: "5px",
                      marginBottom: "5px",
                    }}
                    disabled={!image1 || !image2}
                  >
                    {field.label}
                  </button>
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

      {/* custom cursor */}
      {calibrateField && (
        <div
          style={{
            position: "fixed",
            left: mousePos.x,
            top: mousePos.y,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            color: fieldColors[calibrateField.label] || "red",
            fontSize: "20px",
            zIndex: 9999,
          }}
        >
          <MDBIcon fas icon="crosshairs" />
        </div>
      )}
    </div>
  );
}
