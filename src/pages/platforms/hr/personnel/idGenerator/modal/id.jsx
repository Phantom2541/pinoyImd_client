import React, { useState, useRef, useCallback, useEffect } from "react";
import { Cloudinary } from "../../../../../../services/utilities";
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
  layout,
}) {
  const [draggingKey, setDraggingKey] = useState(null);
  const containerRef = useRef(null);
  const [base64Cache, setBase64Cache] = useState({}); // cache for img & signature

  // 🔧 helper to convert image URL → base64
  const toBase64 = async (url) => {
    if (!url) return null;
    try {
      const res = await fetch(url, { mode: "cors" });
      const blob = await res.blob();
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("Failed to convert to base64:", url, err);
      return url; // fallback to normal url
    }
  };

  // 🔧 pre-convert only img & signature values
  useEffect(() => {
    placedValues.forEach((p) => {
      if ((p.key === "img" || p.key === "signature") && p.value) {
        if (!p.value.startsWith("data:image/")) {
          toBase64(`${Cloudinary.getEndpoint()}/${p.value}`).then((b64) => {
            setBase64Cache((prev) => ({ ...prev, [p.key]: b64 }));
          });
        }
      }
    });
  }, [placedValues]);

  const startDrag = useCallback(
    (e, key, x, y) => {
      e.preventDefault();
      setDraggingKey(key);

      const startX = e.clientX;
      const startY = e.clientY;

      const onMouseMove = (moveEvent) => {
        moveEvent.preventDefault();
        handleUpdateValue(
          {
            x: x + moveEvent.clientX - startX,
            y: y + moveEvent.clientY - startY,
          },
          key
        );
      };

      const onMouseUp = () => {
        setDraggingKey(null);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [handleUpdateValue]
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
              if (p.key !== "img") startDrag(e, p.key, pos.x, pos.y);
            },
            onClick: (e) => {
              e.stopPropagation();
              if (p.key !== "img") onSelect(p.key);
            },
            style: {
              top: pos.y,
              left: pos.x,
              position: "absolute",
              userSelect: "none",
              cursor: p.key === "img" ? "default" : "grab",
              display: "inline-block",
              ...styleFromDFP,
              outline:
                p.key === selectedKey && p.key !== "img"
                  ? "2px dashed #007bff"
                  : "none",
            },
          };

          // ✅ convert img/signature to base64 if still URL
          if (
            (p.key === "img" || p.key === "signature") &&
            typeof p.value === "string" &&
            !p.value.startsWith("data:image/")
          ) {
            // fetch and convert once
            fetch(`${Cloudinary.getEndpoint()}/${p.value}`)
              .then((res) => res.blob())
              .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                  // replace value with base64 para sa susunod na render
                  handleUpdateValue({ value: reader.result }, p.key);
                };
                reader.readAsDataURL(blob);
              })
              .catch((err) =>
                console.error("❌ Failed to convert", p.key, err)
              );
          }

          return isImage ? (
            <img
              {...commonProps}
              src={
                p.value.startsWith("data:image/")
                  ? p.value
                  : `${Cloudinary.getEndpoint()}/${p.value}`
              }
              alt={p.key}
            />
          ) : (
            <div {...commonProps}>{p.value}</div>
          );
        }),
    [placedValues, selectedKey, onSelect, startDrag, handleUpdateValue]
  );

  return (
    <div
      className={`id-generator-container ${layout}`}
      ref={containerRef}
      onClick={() => onSelect(null)}
      style={{ position: "relative" }}
    >
      <div
        className={`id-generator-preview-wrapper ${layout}`}
        style={{ position: "relative" }}
        ref={frontRef}
      >
        <img className="id-generator-preview" src={frontImage} alt="front" />
        {renderValues("front")}
      </div>
      <div
        className={`id-generator-preview-wrapper ${layout}`}
        style={{ position: "relative" }}
        ref={backRef}
      >
        <img className="id-generator-preview" src={backImage} alt="back" />
        {renderValues("back")}
      </div>
    </div>
  );
}
