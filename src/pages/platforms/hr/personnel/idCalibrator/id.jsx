import React, { useState, useRef } from "react";
import { MDBIcon } from "mdbreact";
import "./style.css";
import { fakeEMP } from "./fakeDB";
import { FontWeights } from "./toolkit/fontStyle";

export default function ID({
  frontImage,
  backImage,
  handleFrontChange,
  handleBackChange,
  layout,
  placedValues,
  setPlacedValues,
  floatingValue,
  setFloatingValue,
  cursorPos,
  setCursorPos,
  setSelectedSide,
  selectedSide,
  setSelectedValue,
  selectedValue,
  showAllValues,
}) {
  // const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  const valueToKeyMap = {
    [fakeEMP.front.emp]: "FullName",
    [fakeEMP.front.img]: "Profile",
    [fakeEMP.front.position]: "position",
    [fakeEMP.front.department]: "department",
    [fakeEMP.back.signature]: "signature",
    [fakeEMP.back.dob]: "birthday",
    [fakeEMP.back.address]: "address",
    [fakeEMP.back.guardian]: "guardian",
    [fakeEMP.back.pn]: "Phone number",
  };

  const defaultTextStyle = {
    color: "black",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
    letterSpacing: "0",
    FontWeights: "regular",
  };

  const defaultImageStyle = {
    width: "100px",
    height: "100px",
    borderRadius: 0,
    opacity: 100,
  };

  // ------------------- Click & Place -------------------
  const handleClickOnImage = (target, e) => {
    if (!floatingValue) {
      setSelectedValue(null);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const isImage =
      typeof floatingValue === "string" &&
      floatingValue.match(/\.(jpeg|jpg|gif|png|svg)$/i);

    const newPlaced = {
      id: Date.now(),
      key: valueToKeyMap[floatingValue] || floatingValue,
      value: floatingValue,
      x,
      y,
      target,
      style: isImage ? { ...defaultImageStyle } : { ...defaultTextStyle }, // 👈 default styles here
    };

    setPlacedValues([...placedValues, newPlaced]);
    setSelectedValue({ ...newPlaced, index: placedValues.length, target });
    setFloatingValue(null);
    document.body.style.cursor = "auto";
  };

  const handleMouseMove = (e) => {
    if (floatingValue) {
      setCursorPos({ x: e.clientX + 10, y: e.clientY + 10 });
    }

    if (dragging) {
      const { rect } = dragging;
      const x = e.clientX - rect.left - dragOffset.x;
      const y = e.clientY - rect.top - dragOffset.y;

      setPlacedValues((prev) =>
        prev.map((p, i) =>
          i === dragging.index && p.target === dragging.target
            ? { ...p, x, y }
            : p
        )
      );

      // 🔹 keep selectedValue updated in real-time
      setSelectedValue((prev) =>
        prev && prev.index === dragging.index && prev.target === dragging.target
          ? { ...prev, x, y }
          : prev
      );
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  // ------------------- Helper Component -------------------
  const PlacedValues = ({ target }) =>
    placedValues.map((p, i) => {
      if (p.target !== target) return null; // filter dito, pero retain original index i

      const handleRemove = () => {
        setPlacedValues((prev) => prev.filter((p2) => p2.id !== p.id));
        if (selectedValue?.id === p.id) {
          setSelectedValue(null);
        }
      };

      const isImage =
        typeof p.value === "string" &&
        p.value.match(/\.(jpeg|jpg|gif|png|svg)$/i);

      const handleMouseDown = (e) => {
        // ❌ check if click is on remove button
        if (e.target.closest(".id-calibrator-detail-remove")) return;
        e.stopPropagation();
        const rect = e.currentTarget.parentElement.getBoundingClientRect();
        // 👆 parentElement = yung IDPreview wrapper

        setDragging({ index: i, target, rect }); // store rect kasama sa dragging
        setSelectedValue({ ...p, index: i, target });
        setDragOffset({
          x: e.clientX - rect.left - p.x,
          y: e.clientY - rect.top - p.y,
        });
      };

      return (
        <div
          key={p.id}
          className={`id-calibrator-placed-value ${
            selectedValue?.index === i && selectedValue?.target === target
              ? "selected"
              : ""
          } ${showAllValues ? "highlight" : ""}`}
          style={{
            top: p.y,
            left: p.x,
            position: "absolute",
            userSelect: "none",
            cursor: "grab",
            ...p.style,
          }}
          onMouseDown={handleMouseDown}
          onClick={(e) => e.stopPropagation()}
        >
          {isImage ? (
            <img
              src={p.value}
              alt="placed"
              draggable={false}
              style={{
                ...p.style,

                objectFit: "fill",
                maxHeight: "200px",
                maxWidth: "200px",
              }}
            />
          ) : (
            <span
              className={`id-calibrator-placed-value-text ${
                showAllValues ? "highlight" : ""
              }`}
            >
              {p.value}
            </span>
          )}

          <span
            className="id-calibrator-detail-remove"
            onClick={(e) => {
              e.stopPropagation();
              setPlacedValues((prev) =>
                prev.filter((item) => item.id !== p.id)
              );
              if (selectedValue?.id === p.id) {
                setSelectedValue(null);
              }
            }}
            style={{ marginLeft: "4px", cursor: "pointer" }}
          >
            <MDBIcon icon="times" />
          </span>
        </div>
      );
    });

  const IDPreview = ({ image, target, handleChange }) => (
    <div
      className={`id-calibrator-preview ${layout || "landscape"}`}
      onClick={(e) => handleClickOnImage(target, e)}
      style={{ position: "relative" }}
    >
      {!image && (
        <>
          <label
            className="id-calibrator-preview-upload"
            htmlFor={`uploadimg${target}`}
          >
            <MDBIcon icon="plus" />
          </label>
          <span className="id-calibrator-preview-label">{target}</span>
        </>
      )}

      {image && (
        <img
          className={`id-calibrator-preview-image ${
            selectedSide === target ? "active" : ""
          }`}
          src={image}
          alt={`${target} ID Preview`}
          draggable={false}
          onClick={() => setSelectedSide(target)}
        />
      )}
      <PlacedValues target={target} />
      <input
        id={`uploadimg${target}`}
        type="file"
        hidden
        onChange={handleChange}
      />
    </div>
  );

  return (
    <div
      className="id-calibrator-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSelectedValue(null);
        }
      }}
    >
      <div className="id-calibrator-preview-wrapper">
        <IDPreview
          image={frontImage}
          target="front"
          handleChange={handleFrontChange}
        />
        <IDPreview
          image={backImage}
          target="back"
          handleChange={handleBackChange}
        />
      </div>

      {/* Floating value that follows cursor */}
      {floatingValue && (
        <div
          style={{
            position: "fixed",
            top: cursorPos.y,
            left: cursorPos.x,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            background: "#1976d2",
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "14px",
            zIndex: 9999,
          }}
        >
          {typeof floatingValue === "string" &&
          floatingValue.match(/\.(jpeg|jpg|gif|png|svg)$/i) ? (
            <img
              src={floatingValue}
              alt="floating"
              style={{ maxWidth: 50, maxHeight: 50 }}
            />
          ) : (
            floatingValue
          )}
        </div>
      )}
    </div>
  );
}
