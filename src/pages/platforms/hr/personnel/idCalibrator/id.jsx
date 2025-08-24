import { MDBIcon } from "mdbreact";
import React, { useRef } from "react";
import "./style.css";

export default function ID({
  frontImage,
  backImage,
  handleFrontChange,
  handleBackChange,
  layout,
  placedValues,
  setPlacedValues,
  draggedValue,
  setDraggedValue,
  floatingValue,
  setFloatingValue,
  cursorPos,
  setCursorPos,
}) {
  const clickRef = useRef(false); // NEW: tracks if a drag occurred

  // ------------------- Drag & Drop -------------------
  const handleDrop = (e, target) => {
    e.preventDefault();
    const value =
      e.dataTransfer.getData("text/plain") || draggedValue || floatingValue;
    if (!value) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPlacedValues([...placedValues, { value, x, y, target }]);
    setDraggedValue(null);
    setFloatingValue(null);
    document.body.style.cursor = "auto";
  };

  const handleDragOver = (e) => e.preventDefault();

  // ------------------- Click & Follow Cursor -------------------
  const handleClickOnImage = (target, e) => {
    // Ignore clicks on already placed images or after a drag
    if (
      e.target.closest(".id-calibrator-placed-value") ||
      !floatingValue ||
      !clickRef.current
    )
      return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPlacedValues([...placedValues, { value: floatingValue, x, y, target }]);
    setFloatingValue(null);
    document.body.style.cursor = "auto";
  };

  const handleMouseMove = (e) => {
    if (floatingValue) setCursorPos({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  // ------------------- Drag Helper -------------------
  const makeDraggable = (index) => (e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const orig = placedValues[index];

    clickRef.current = true; // assume click until movement detected

    const handleMouseMove = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      // if moved more than 3px, consider a drag
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) clickRef.current = false;

      setPlacedValues((prev) =>
        prev.map((item, idx) =>
          idx === index ? { ...item, x: orig.x + dx, y: orig.y + dy } : item
        )
      );
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  // ------------------- Helper Component -------------------
  const PlacedValues = ({ target }) =>
    placedValues
      .filter((p) => p.target === target)
      .map((p, i) => {
        const handleMouseDown = (e) => makeDraggable(i, p)(e);
        const handleRemove = () => {
          setPlacedValues((prev) => prev.filter((_, idx) => idx !== i));
        };

        const isImage =
          typeof p.value === "string" &&
          p.value.match(/\.(jpeg|jpg|gif|png|svg)$/i);

        return (
          <div
            key={i}
            onMouseDown={handleMouseDown}
            className="id-calibrator-placed-value"
            style={{
              top: p.y,
              left: p.x,
              cursor: "move",
              position: "absolute",
              userSelect: "none",
            }}
          >
            {isImage ? (
              <img
                src={p.value}
                alt="placed"
                style={{ maxWidth: 50, maxHeight: 50 }}
              />
            ) : (
              <>
                {p.value}
                <span
                  className="id-calibrator-detail-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  style={{ marginLeft: "4px", cursor: "pointer" }}
                >
                  <MDBIcon icon="times" />
                </span>
              </>
            )}
          </div>
        );
      });

  const IDPreview = ({ image, target, handleChange }) => (
    <div
      className={`id-calibrator-preview ${
        layout === "Portrait" ? "portrait" : "landscape"
      }`}
      onDrop={(e) => handleDrop(e, target)}
      onDragOver={handleDragOver}
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
          className="id-calibrator-preview-image"
          src={image}
          alt={`${target} ID Preview`}
          draggable={false}
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
    <div className="id-calibrator-container" onMouseMove={handleMouseMove}>
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

      {/* Floating draggable value */}
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
