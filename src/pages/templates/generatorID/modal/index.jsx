import { MDBBtn, MDBIcon } from "mdbreact";
import React, { useState, useEffect } from "react";
import { fakeEMP } from "./fakeDB";
import Setting from "../setting";

export default function Modal({ isModalOpen, setIsModalOpen, onSave }) {
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [orientation, setOrientation] = useState("portrait");
  const [dragValue, setDragValue] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [placedValues, setPlacedValues] = useState([]);
  const [draggingId, setDraggingId] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedValueId, setSelectedValueId] = useState(null);

  useEffect(() => {
    const handleMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const formatFullName = (f) =>
    [f.title, f.fname, f.mname, f.lname, f.suffix].filter(Boolean).join(" ");
  const formatAddress = (a) =>
    [a.barangay, a.city, a.province, a.region].filter(Boolean).join(", ");
  const formatPhone = (num) => {
    if (!num) return "";
    let digits = num.replace(/\D/g, "");
    if (digits.startsWith("0")) digits = "63" + digits.slice(1);
    if (!digits.startsWith("63")) digits = "63" + digits;
    return digits.replace(/^(63)(\d{3})(\d{3})(\d{4})$/, "+$1 $2 $3 $4");
  };

  const mappedEMP = {
    ID: fakeEMP.id,
    FullName: formatFullName(fakeEMP.fullName),
    Address: formatAddress(fakeEMP.address),
    Position: fakeEMP.position,
    Department: fakeEMP.department,
    DOB: fakeEMP.dob,
    Mobile: formatPhone(fakeEMP.mobile),
    Email: fakeEMP.email,
    ProfileImage: fakeEMP.profileImage,
    "Contact FullName": formatFullName(fakeEMP.contactInfo.fullName),
    "Contact Address": formatAddress(fakeEMP.contactInfo.address),
    "Contact Number": formatPhone(fakeEMP.contactInfo.pn),
  };

  const handleDrop = (e, target, key) => {
    if (!dragValue) return;
    const container = document.querySelector(
      `.IDGenerator-template-preview.${target}`
    );
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const defaultPos = fakeEMP.dfp[key] || {};

    // Temporary element para makuha size
    const tempEl = document.createElement("span");
    tempEl.style.position = "absolute";
    tempEl.style.visibility = "hidden";
    tempEl.style.padding =
      dragValue.startsWith("data:") || dragValue.startsWith("http")
        ? "0"
        : "2px 4px";

    if (dragValue.startsWith("data:") || dragValue.startsWith("http")) {
      const img = document.createElement("img");
      img.src = dragValue;
      img.style.maxWidth = "100px";
      img.style.maxHeight = "100px";
      tempEl.appendChild(img);
    } else {
      tempEl.innerText = dragValue;
    }

    container.appendChild(tempEl);
    const elWidth = tempEl.offsetWidth;
    const elHeight = tempEl.offsetHeight;
    container.removeChild(tempEl);

    let x = defaultPos.x ? defaultPos.x : e.clientX - rect.left - elWidth / 2;
    let y = defaultPos.y ? defaultPos.y : e.clientY - rect.top - elHeight / 2;

    x = Math.max(0, Math.min(x, rect.width - elWidth));
    y = Math.max(0, Math.min(y, rect.height - elHeight));

    setPlacedValues((prev) => {
      const index = prev.findIndex(
        (p) => p.target === target && p.value === dragValue
      );
      if (index !== -1) {
        const newArr = [...prev];
        newArr[index] = { ...newArr[index], x, y, ...defaultPos };
        return newArr;
      }
      return [
        ...prev,
        {
          id: Date.now(),
          target,
          value: dragValue,
          x,
          y,
          fontSize: 12,
          fontFamily: "Arial",
          fontWeight: "normal",
          color: "#000000",
          letterSpacing: 0,
          width: 100,
          height: 100,
          border: "none",
          borderRadius: 0,
          opacity: 1,
          ...defaultPos,
        },
      ];
    });

    setDragValue(null);
  };

  const handleMouseDown = (id, e) => {
    e.stopPropagation();
    setSelectedValueId(id); // add this
    const p = placedValues.find((p) => p.id === id);
    if (!p) return;

    const container = document.querySelector(
      `.IDGenerator-template-preview.${p.target}`
    );
    if (!container) return;

    const rect = container.getBoundingClientRect();
    setDraggingId(id);
    setOffset({
      x: e.clientX - rect.left - p.x,
      y: e.clientY - rect.top - p.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingId) return;

    const p = placedValues.find((p) => p.id === draggingId);
    if (!p) return;

    const container = document.querySelector(
      `.IDGenerator-template-preview.${p.target}`
    );
    if (!container) return;

    const rect = container.getBoundingClientRect();
    let x = e.clientX - rect.left - offset.x;
    let y = e.clientY - rect.top - offset.y;

    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    updatePlacedValuePosition(draggingId, x, y);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", () => setDraggingId(null));
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", () => setDraggingId(null));
    };
  }, [draggingId, offset]);

  const selectedValue = placedValues.find((p) => p.id === selectedValueId);

  // Function to update position
  const updatePosition = (x, y) => {
    if (!selectedValueId) return;
    setPlacedValues((prev) =>
      prev.map((p) => (p.id === selectedValueId ? { ...p, x, y } : p))
    );
  };

  // Function to update style (font size, font family, font weight)
  const updateStyle = (style) => {
    if (!selectedValueId) return;
    setPlacedValues((prev) =>
      prev.map((p) => (p.id === selectedValueId ? { ...p, ...style } : p))
    );
  };

  const updatePlacedValuePosition = (id, newX, newY) => {
    setPlacedValues((prev) =>
      prev.map((p) => (p.id === id ? { ...p, x: newX, y: newY } : p))
    );
  };

  const getDFPData = () => {
    const dfp = {};
    Object.entries(mappedEMP).forEach(([key, value]) => {
      const placed = placedValues.find((p) => p.value === value);
      if (!placed) return;

      dfp[key] = {
        x: placed.x,
        y: placed.y,
        target: placed.target,
      };

      if (value.startsWith("data:") || value.startsWith("http")) {
        if (placed.width) dfp[key].width = placed.width;
        if (placed.height) dfp[key].height = placed.height;
        if (placed.border)
          dfp[key].border = `${placed.border}px solid ${
            placed.borderColor || "#000"
          }`;
        if (placed.borderRadius) dfp[key].borderRadius = placed.borderRadius;
        if (placed.opacity !== undefined) dfp[key].opacity = placed.opacity;
      } else {
        if (placed.fontFamily) dfp[key].font = placed.fontFamily;
        if (placed.fontSize) dfp[key].size = placed.fontSize;
        if (placed.color) dfp[key].color = placed.color;
        if (placed.fontWeight) dfp[key].weight = placed.fontWeight;
        if (placed.letterSpacing) dfp[key].letterSpacing = placed.letterSpacing;
      }
    });
    return dfp;
  };

  const renderPlacedValues = (target) =>
    placedValues
      .filter((p) => p.target === target)
      .map((p) => {
        const style = {
          position: "absolute",
          left: p.x,
          top: p.y,
          cursor: "move",
          background: draggingId === p.id ? "rgba(0,0,0,0.1)" : "transparent",
          padding:
            p.value.startsWith("data:") || p.value.startsWith("http")
              ? 0
              : "2px 4px",
          userSelect: "none",
          zIndex: draggingId === p.id ? 999 : 1,
          fontSize: p.fontSize ? `${p.fontSize}px` : undefined,
          fontFamily: p.fontFamily || undefined,
          fontWeight: p.fontWeight || undefined,
          color: p.color || "#000", // ← dapat idagdag
          letterSpacing: p.letterSpacing ? `${p.letterSpacing}px` : undefined, // ← dapat idagdag
        };

        return (
          <span
            key={p.id}
            onMouseDown={(e) => handleMouseDown(p.id, e)}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedValueId(p.id);
            }}
            className="IDGenerator-template-previewData"
            style={style}
          >
            {p.value.startsWith("data:") || p.value.startsWith("http") ? (
              <img
                src={p.value}
                alt="dynamic"
                style={{
                  width: p.width ? `${p.width}px` : "auto",
                  height: p.height ? `${p.height}px` : "auto",
                  border: p.border
                    ? `${p.border}px solid ${p.borderColor || "#000"}`
                    : "none", // ← dito pinagsama yung number + color
                  borderRadius: p.borderRadius ? `${p.borderRadius}px` : 0,
                  opacity: p.opacity !== undefined ? p.opacity : 1,
                  maxWidth: 200,
                  maxHeight: 200,
                  pointerEvents: "none",
                }}
              />
            ) : (
              p.value
            )}
            <span
              className="IDGenerator-template-remove"
              onClick={(e) => {
                e.stopPropagation();
                setPlacedValues((prev) =>
                  prev.filter((item) => item.id !== p.id)
                );
              }}
            >
              <MDBIcon icon="times" />
            </span>
          </span>
        );
      });

  return (
    <div className={`IDGenerator-modal ${isModalOpen ? "active" : ""}`}>
      <div className="IDGenerator-content">
        <div className="IDGenerator-modal-header">
          <span className="IDGenerator-modal-header-title">Add a template</span>
          <MDBIcon
            className="IDGenerator-modal-header-close"
            icon="times"
            onClick={() => setIsModalOpen(false)}
          />
        </div>

        <div className="IDGenerator-modal-body">
          <div className="IDGenerator-template-container">
            <select
              className="form-control"
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
            >
              <option value="portrait">Portrait</option>
              <option value="landscape">Landscape</option>
            </select>

            <div
              className={`IDGenerator-template-preview-wrapper ${orientation}`}
            >
              <div
                className={`IDGenerator-template-preview front ${orientation}`}
                onClick={(e) => handleDrop(e, "front")}
              >
                <label
                  htmlFor="frontImageInput"
                  className={`IDGenerator-template-addImg ${
                    frontImage && "hide"
                  }`}
                >
                  <MDBIcon icon="plus" />
                </label>
                <label
                  htmlFor="frontImageInput"
                  className={`IDGenerator-template-changeImg ${
                    !frontImage && "hide"
                  }`}
                >
                  Change Template
                </label>
                {frontImage && (
                  <img
                    src={frontImage}
                    alt="front ID"
                    draggable={false}
                    style={{ userSelect: "none", pointerEvents: "none" }}
                  />
                )}
                {renderPlacedValues("front")}
                <input
                  id="frontImageInput"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setFrontImage(URL.createObjectURL(file));
                  }}
                />
              </div>

              <div
                className={`IDGenerator-template-preview back ${orientation}`}
                onClick={(e) => handleDrop(e, "back")}
              >
                <label
                  htmlFor="backImageInput"
                  className={`IDGenerator-template-addImg ${
                    backImage && "hide"
                  }`}
                >
                  <MDBIcon icon="plus" />
                </label>
                <label
                  htmlFor="backImageInput"
                  className={`IDGenerator-template-changeImg ${
                    !backImage && "hide"
                  }`}
                >
                  Change Template
                </label>
                {backImage && (
                  <img
                    src={backImage}
                    alt="back ID"
                    draggable={false}
                    style={{ userSelect: "none", pointerEvents: "none" }}
                  />
                )}
                {renderPlacedValues("back")}
                <input
                  id="backImageInput"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setBackImage(URL.createObjectURL(file));
                  }}
                />
              </div>
            </div>
          </div>

          <div className="IDGenerator-template-buttons">
            {Object.entries(mappedEMP).map(([key, value]) => (
              <div key={key} className="IDGenerator-template-button">
                <label>{key}</label>
                <MDBBtn
                  className="IDGenerator-template-buttonBtn"
                  color="primary"
                  size="sm"
                  onClick={() => {
                    setPlacedValues((prev) =>
                      prev.filter((p) => p.value !== value)
                    );
                    setDragValue(value);
                  }}
                >
                  {typeof value === "string" &&
                  (value.startsWith("data:") || value.startsWith("http")) ? (
                    <img
                      src={value}
                      alt={key}
                      style={{
                        maxWidth: 50,
                        maxHeight: 50,
                        pointerEvents: "none",
                      }}
                    />
                  ) : (
                    value
                  )}
                </MDBBtn>
              </div>
            ))}
          </div>
          <Setting
            placedValue={selectedValue}
            updatePosition={updatePosition}
            updateStyle={updateStyle}
          />
        </div>
        <div className="IDGenerator-modal-footer">
          <MDBBtn
            color="primary"
            onClick={() => {
              const dfpData = getDFPData();
              console.log("DFP DATA:", dfpData);
              if (typeof onSave === "function") {
                onSave(dfpData, frontImage, backImage);
              }
            }}
          >
            Save
          </MDBBtn>
        </div>
      </div>

      {dragValue && (
        <div
          style={{
            position: "fixed",
            left: mousePos.x,
            top: mousePos.y,
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
            background: "rgba(0,0,0,0.7)",
            color: "#fff",
            padding:
              dragValue.startsWith("data:") || dragValue.startsWith("http")
                ? 0
                : "2px 6px",
            borderRadius: "4px",
            zIndex: 9999,
          }}
        >
          {dragValue.startsWith("data:") || dragValue.startsWith("http") ? (
            <img
              src={dragValue}
              alt="dragging"
              style={{ maxWidth: 100, maxHeight: 100, pointerEvents: "none" }}
            />
          ) : (
            dragValue
          )}
        </div>
      )}
    </div>
  );
}
