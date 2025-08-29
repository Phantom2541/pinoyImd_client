import React, { useState, useRef, useCallback } from "react";
import "./style.css";

export default function ID({
  frontImage,
  backImage,
  placedValues,
  selectedKey,
  onSelect,
  handleUpdateValue,
  frontRef,
  backRef,
}) {
  const [draggingKey, setDraggingKey] = useState(null);
  const containerRef = useRef(null);

  const startDrag = useCallback(
    (e, key, x, y) => {
      e.preventDefault();
      console.log(draggingKey);

      setDraggingKey(key);

      const startX = e.clientX;
      const startY = e.clientY;

      const onMouseMove = (moveEvent) => {
        moveEvent.preventDefault();
        handleUpdateValue({
          x: x + moveEvent.clientX - startX,
          y: y + moveEvent.clientY - startY,
        });
      };

      const onMouseUp = () => {
        setDraggingKey(null);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [draggingKey, handleUpdateValue]
  );

  const renderValues = useCallback(
    (side) =>
      placedValues
        .filter((p) =>
          p.target === "front" ? side === "front" : side === "back"
        )
        .map((p) => {
          const isImage =
            typeof p.value === "string" &&
            (p.value.startsWith("data:image/") ||
              /\.(png|jpe?g|gif)$/i.test(p.value));

          const pos = { x: p.x, y: p.y };
          const styleFromDFP = {
            fontFamily: p.fontFamily,
            fontSize: p.fontSize,
            fontWeight: p.fontWeight,
            fontStyle: p.fontStyle || "normal",
            color: p.color,
            letterSpacing: p.letterSpacing,
            width: p.width || "auto",
            height: p.height || "auto",
            borderRadius: p.borderRadius,
            border: p.border,
            borderBottom: p.borderBottom,
            opacity: p.opacity ?? 1,
          };

          const commonProps = {
            key: p.key,
            onMouseDown: (e) => {
              e.stopPropagation();
              if (p.key !== "profile") startDrag(e, p.key, pos.x, pos.y);
            },
            onClick: (e) => {
              e.stopPropagation();
              if (p.key !== "profile") onSelect(p.key);
            },
            style: {
              top: pos.y,
              left: pos.x,
              position: "absolute",
              userSelect: "none",
              cursor: p.key === "profile" ? "default" : "grab",
              display: "inline-block",
              ...styleFromDFP,
              outline:
                p.key === selectedKey && p.key !== "profile"
                  ? "2px dashed #007bff"
                  : "none",
            },
          };

          return isImage ? (
            <img {...commonProps} src={p.value} alt={p.key} />
          ) : (
            <div {...commonProps}>{p.value}</div>
          );
        }),
    [placedValues, selectedKey, onSelect, startDrag]
  );

  return (
    <div
      className="id-generator-container"
      ref={containerRef}
      onClick={() => onSelect(null)}
      style={{ position: "relative" }}
    >
      <div
        className="id-generator-preview-wrapper"
        style={{ position: "relative" }}
        ref={frontRef}
      >
        <img className="id-generator-preview" src={frontImage} alt="front" />
        {renderValues("front")}
      </div>
      <div
        className="id-generator-preview-wrapper"
        style={{ position: "relative" }}
        ref={backRef}
      >
        <img className="id-generator-preview" src={backImage} alt="back" />
        {renderValues("back")}
      </div>
    </div>
  );
}
