import React, { useState, useRef, useCallback, useEffect } from "react";
import { Cloudinary, ENDPOINT } from "../../../../../../services/utilities";
import "./style.css";
import QrCodeGenerator from "../../../../../../components/qrCode";
import { useSelector } from "react-redux";
import BarCodeGenerator from "../../../../../../components/barCode";

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
  const { company } = useSelector(({ auth }) => auth);
  const [draggingKey, setDraggingKey] = useState(null);
  const containerRef = useRef(null);
  const [base64Cache, setBase64Cache] = useState({}); // cache for img & signature
  console.log(draggingKey, base64Cache);

  // 🔧 helper: image URL → base64
  const toBase64 = async (url) => {
    if (!url) return null;
    try {
      const res = await fetch(url, { mode: "cors" });
      const blob = await res.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.error("Failed to convert to base64:", url, err);
      return url; // fallback
    }
  };

  console.log("plaacedValues", placedValues, selectedKey);

  // 🔧 pre-convert only img & signature values
  useEffect(() => {
    placedValues.forEach((p) => {
      if (
        (p.key === "img" || p.key === "signature") &&
        p.value &&
        !p.value.startsWith("data:image/")
      ) {
        toBase64(`${Cloudinary.getEndpoint()}/${p.value}`).then((b64) => {
          if (b64) setBase64Cache((prev) => ({ ...prev, [p.key]: b64 }));
        });
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

          const isFixed = p.key === "img" || p.key === "signature";
          const pos = { x: p.x, y: p.y };

          const commonProps = {
            key: p.key,
            onMouseDown: (e) => {
              e.stopPropagation();
              if (!isFixed) startDrag(e, p.key, pos.x, pos.y);
            },
            onClick: (e) => {
              e.stopPropagation();
              if (!isFixed) onSelect(p.key);
            },
            style: {
              top: pos.y,
              left: pos.x,
              position: "absolute",
              userSelect: "none",
              cursor: isFixed ? "default" : "grab",
              display: "inline-block",
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
              transform: p.transform,
              opacity: p.opacity ?? 1,
              outline:
                p.key === selectedKey && !isFixed
                  ? "2px dashed #007bff"
                  : "none",
              textAlign: "center",
            },
          };

          // ✅ QR code render
          if (p.key === "qr" && p.value) {
            return (
              <div {...commonProps}>
                <QrCodeGenerator
                  value={`${ENDPOINT}/icard/portal/${company?._id}/${p.value}`}
                  size={p.width || 50}
                />
              </div>
            );
          }

          // ✅ QR code render
          if (p.key === "bar" && p.value) {
            console.log(
              "barcode",
              `${ENDPOINT}/icard/portal/${company?._id}/${p.value}`
            );
            return (
              <div {...commonProps}>
                <BarCodeGenerator
                  value={`${ENDPOINT}/icard/portal/${company?._id}/${p.value}`}
                  width={p.width || 50}
                  height={p.height || 50}
                />
              </div>
            );
          }

          // ✅ image/signature render
          if (isImage) {
            return (
              <img
                {...commonProps}
                src={
                  p.value.startsWith("data:image/")
                    ? p.value
                    : `${Cloudinary.getEndpoint()}/${p.value}`
                }
                alt={p.key}
              />
            );
          }

          // ✅ text render (default)
          return <div {...commonProps}>{p.value}</div>;
        }),
    [placedValues, selectedKey, startDrag, onSelect, company]
  );

  return (
    <div
      className={`id-generator-container ${layout}`}
      ref={containerRef}
      onClick={() => onSelect(null)}
      style={{ position: "relative" }}
    >
      {["front", "back"].map((side) => {
        const hasImage = side === "front" ? frontImage : backImage;

        return (
          <div
            key={side}
            className={`id-generator-preview-wrapper ${layout}`}
            style={{ position: "relative" }}
            ref={side === "front" ? frontRef : backRef}
          >
            {hasImage ? (
              <>
                <img
                  className="id-generator-preview"
                  src={hasImage}
                  alt={side}
                />
                {renderValues(side)}
              </>
            ) : (
              <div className="id-generator-noFrontAndBackImage">
                <i
                  className="fas fa-info-circle text-warning"
                  style={{ fontSize: "20px", color: "#888" }}
                ></i>
                <span>{side} template not found.</span>
                <span>
                  Please upload the required template in the
                  <br />
                  <strong> ID Calibrator</strong>.
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
