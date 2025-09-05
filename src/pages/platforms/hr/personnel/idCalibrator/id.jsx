import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setFloatingValue,
  setCursorPos,
  setSelectedSide,
  setSelectedValue,
} from "../../../../../services/redux/slices/idCard/calibrator";
import { MDBIcon } from "mdbreact";
import "./style.css";
import { fakeEMP } from "./fakeDB";

export default function ID({
  handleFrontChange,
  handleBackChange,
  placedValues,
  setPlacedValues,
  lockAspectRatio,
}) {
  const {
      frontImage,
      backImage,
      frontLoading,
      backLoading,
      floatingValue,
      cursorPos,
      selectedSide,
      selectedValue,
      showAllValues,
      lockAspect,
      layout,
      editMode,
    } = useSelector(({ idCalibrator }) => idCalibrator),
    dispatch = useDispatch();
  // const [draggingIndex, setDraggingIndex] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  const valueToKeyMap = {
    [fakeEMP.front.empID]: "id",
    [fakeEMP.front.emp]: "fullName",
    [fakeEMP.front.img]: "profile",
    [fakeEMP.front.position]: "position",
    [fakeEMP.front.department]: "department",
    [fakeEMP.back.signature]: "signature",
    [fakeEMP.back.dob]: "birthday",
    [fakeEMP.back.address]: "address",
    [fakeEMP.back.guardian]: "guardian",
    [fakeEMP.back.pn]: "phone number",
  };

  const defaultTextStyle = {
    color: "black",
    fontSize: "16px",
    fontFamily: "Arial, sans-serif",
    letterSpacing: "0",
    FontWeight: "regular",
    borderBottom: "none",
  };

  const defaultImageStyle = {
    width: "100px",
    height: "100px",
    borderRadius: 0,
    opacity: 1,
  };

  // ------------------- Click & Place -------------------
  const handleClickOnImage = (target, e) => {
    if (!floatingValue) return dispatch(setSelectedValue(null));

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const isImage =
      typeof floatingValue === "string" &&
      floatingValue.match(/\.(jpeg|jpg|gif|png|svg)$/i);

    // 🔹 Hanapin kung QR o Bar gamit fakeEMP
    let key = Object.keys(fakeEMP.front).find(
      (k) => fakeEMP.front[k] === floatingValue
    );
    if (!key) {
      key = Object.keys(fakeEMP.back).find(
        (k) => fakeEMP.back[k] === floatingValue
      );
    }

    // fallback kung wala
    if (!key) key = floatingValue;

    setPlacedValues((prev) => {
      let filtered = prev;

      if (key === "qr") {
        filtered = prev.filter((p) => p.key !== "bar"); // remove barcode if exists
      } else if (key === "bar") {
        filtered = prev.filter((p) => p.key !== "qr"); // remove QR if exists
      }

      const newPlaced = {
        id: Date.now(),
        key,
        value: floatingValue,
        x,
        y,
        target,
        style: isImage ? { ...defaultImageStyle } : { ...defaultTextStyle },
      };

      return [...filtered, newPlaced];
    });

    dispatch(setFloatingValue(null));
    document.body.style.cursor = "auto";
  };

  const handleResizeImage = (e, i, target) => {
    e.stopPropagation();

    if (!placedValues[i]) return;

    const startX = e.clientX;
    const startY = e.clientY;

    const item = placedValues[i];
    const startWidth = parseFloat(item.style.width) || 100;
    const startHeight = parseFloat(item.style.height) || 100;
    const aspectRatio = startWidth / startHeight;

    const move = (ev) => {
      let rawWidth = Math.max(50, startWidth + ev.clientX - startX);
      let rawHeight = Math.max(50, startHeight + ev.clientY - startY);

      const driver =
        Math.abs(ev.clientX - startX) > Math.abs(ev.clientY - startY)
          ? "width"
          : "height";

      const { width, height } = lockAspectRatio(
        rawWidth,
        rawHeight,
        lockAspect,
        aspectRatio,
        driver
      );

      // update local placedValues
      setPlacedValues((prev) =>
        prev.map((p, idx) =>
          idx === i && p.target === target
            ? { ...p, style: { ...p.style, width, height } }
            : p
        )
      );

      // update Redux selectedValue (direct payload)
      if (selectedValue?.index === i && selectedValue.target === target) {
        dispatch(
          setSelectedValue({
            ...selectedValue,
            style: { ...selectedValue.style, width, height },
          })
        );
      }
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const handleMouseMove = (e) => {
    if (floatingValue) {
      dispatch(setCursorPos({ x: e.clientX + 10, y: e.clientY + 10 }));
    }

    if (dragging) {
      const { rect } = dragging;
      const item = placedValues[dragging.index];

      const itemWidth = parseInt(item.style.width) || 50;
      const itemHeight = parseInt(item.style.height) || 20;

      let x = e.clientX - rect.left - dragOffset.x;
      let y = e.clientY - rect.top - dragOffset.y;

      // ✅ clamp sa loob ng preview
      x = Math.max(0, Math.min(x, rect.width - itemWidth));
      y = Math.max(0, Math.min(y, rect.height - itemHeight));

      setPlacedValues((prev) =>
        prev.map((p, i) =>
          i === dragging.index && p.target === dragging.target
            ? { ...p, x, y }
            : p
        )
      );

      // ✅ update Redux selectedValue ng tama
      if (
        selectedValue?.index === dragging.index &&
        selectedValue?.target === dragging.target
      ) {
        dispatch(
          setSelectedValue({
            ...selectedValue,
            x,
            y,
          })
        );
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  // ------------------- Helper Component -------------------
  const PlacedValues = ({ target }) =>
    placedValues.map((p, i) => {
      if (p.target !== target) return null; // filter dito, pero retain original index i

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
        dispatch(setSelectedValue({ ...p, index: i, target }));
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
            ...p.style, // rotation at iba pa dito lang
          }}
          onMouseDown={handleMouseDown}
          onClick={(e) => e.stopPropagation()}
        >
          {isImage ? (
            <div
              style={{
                position: "relative",
                display: "inline-block",
                width: p.style.width,
                height: p.style.height,
              }}
            >
              <img
                src={p.value}
                alt="placed"
                draggable={false}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "fill",
                  borderRadius: p.style.borderRadius,
                  opacity: p.style.opacity,
                  border: p.style.border,
                }}
              />
              {/* Resize handle */}
              {selectedValue?.id === p.id && (
                <div
                  onMouseDown={(e) => handleResizeImage(e, i, target)}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 15,
                    height: 15,
                    cursor: "se-resize",
                    clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
                    backgroundColor: "black",
                    boxShadow: "1px 1px 3px rgba(0,0,0,0.3)",
                    zIndex: 10,
                  }}
                />
              )}
            </div>
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
                dispatch(setSelectedValue(null));
              }
            }}
            style={{ marginLeft: "4px", cursor: "pointer" }}
          >
            <MDBIcon icon="times" />
          </span>
        </div>
      );
    });

  const IDPreview = ({ image, target, handleChange, loading, disabled }) => (
    <div
      className={`id-calibrator-preview ${layout || "landscape"} ${
        selectedSide === target ? "active" : ""
      } ${disabled ? "disabled" : ""}`}
      onClick={(e) => !disabled && handleClickOnImage(target, e)}
    >
      {!image && !loading && (
        <>
          <label
            className={`id-calibrator-preview-upload ${
              disabled ? "disabled" : ""
            }`}
            htmlFor={!disabled ? `uploadimg${target}` : undefined}
          >
            <MDBIcon icon="plus" />
          </label>
          <span className="id-calibrator-preview-label">{target}</span>
        </>
      )}

      {loading && (
        <div className="id-calibrator-preview-loading">
          <div className="id-calibrator-preview-loader" />
        </div>
      )}

      {image && !loading && (
        <img
          className="id-calibrator-preview-image"
          src={image}
          alt={`${target} ID Preview`}
          draggable={false}
          onClick={() => !disabled && dispatch(setSelectedSide(target))}
        />
      )}

      <PlacedValues target={target} />

      <input
        id={`uploadimg${target}`}
        type="file"
        hidden
        onChange={handleChange}
        disabled={disabled} // ✅ disabled lang kapag loading yung kabilang side
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
          dispatch(setSelectedValue(null));
        }
      }}
    >
      <div
        className={`id-calibrator-preview-wrapper ${layout || "landscape"} ${
          editMode ? "" : "editMode"
        }`}
      >
        <IDPreview
          image={frontImage}
          target="front"
          handleChange={handleFrontChange}
          loading={frontLoading}
          disabled={backLoading}
        />
        <IDPreview
          image={backImage}
          target="back"
          handleChange={handleBackChange}
          loading={backLoading}
          disabled={frontLoading}
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
            background: "rgba(0,0,0,0.5)",
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
