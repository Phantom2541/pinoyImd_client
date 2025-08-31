import React, { useState, useCallback } from "react";
import {
  Fonts,
  FontSizes,
  FontWeights,
} from "../../idCalibrator/toolkit/fontStyle";
import { useSelector } from "react-redux";
import { MDBIcon } from "mdbreact";
import Input from "../../idCalibrator/toolkit/input";
import Select from "../../idCalibrator/toolkit/select";
import { useDispatch } from "react-redux";
import {
  NEXT,
  PREV,
} from "../../../../../../services/redux/slices/assets/persons/personnels";

const toHex = (color) => {
  const ctx = document.createElement("canvas").getContext("2d");
  ctx.fillStyle = color;
  return ctx.fillStyle;
};

export default function Setting({ selectedValue, onUpdateValue, handleSave }) {
  const { activeIndex, collections } = useSelector(
    ({ personnels }) => personnels
  );
  const [lockAspect, setLockAspect] = useState(false);
  const dispatch = useDispatch();

  const isDisabled = !selectedValue;
  const style = selectedValue || {};
  const isImage =
    typeof selectedValue?.value === "string" &&
    (selectedValue.value.startsWith("data:image/") ||
      /\.(png|jpe?g|gif)$/i.test(selectedValue.value));

  const handleNext = () => dispatch(NEXT(activeIndex + 1));
  const handlePrev = () => dispatch(PREV(activeIndex - 1));

  const updateStyle = useCallback(
    (newStyle) => {
      if (!isDisabled) onUpdateValue(newStyle);
    },
    [isDisabled, onUpdateValue]
  );

  const lockAspectRatio = (w, h, lock, ratio, changed) => {
    if (!lock) return { width: `${w}px`, height: `${h}px` };
    return changed === "width"
      ? { width: `${w}px`, height: `${Math.round(w / ratio)}px` }
      : { width: `${Math.round(h * ratio)}px`, height: `${h}px` };
  };

  return (
    <div className="IDGenerator-setting-container">
      {isImage && (
        <div className="IDGenerator-setting-section">
          <div className="d-flex align-items-end" style={{ gap: "5px" }}>
            <Input
              type="number"
              title="Width"
              unit="px"
              label={<MDBIcon fas icon="arrows-alt-h" />}
              value={parseInt(style.width)}
              disabled={isDisabled}
              onChange={(e) => {
                const newWidth = parseInt(e.target.value, 10) || 0;
                const currentHeight = parseFloat(style.height) || 100;
                const ratio = (parseFloat(style.width) || 100) / currentHeight;
                updateStyle(
                  lockAspectRatio(
                    newWidth,
                    currentHeight,
                    lockAspect,
                    ratio,
                    "width"
                  )
                );
              }}
            />
            <Input
              type="number"
              title="Height"
              unit="px"
              label={<MDBIcon fas icon="arrows-alt-v" />}
              value={parseInt(style.height)}
              disabled={isDisabled}
              onChange={(e) => {
                const newHeight = parseInt(e.target.value, 10) || 0;
                const currentWidth = parseFloat(style.width) || 100;
                const ratio = currentWidth / (parseFloat(style.height) || 100);
                updateStyle(
                  lockAspectRatio(
                    currentWidth,
                    newHeight,
                    lockAspect,
                    ratio,
                    "height"
                  )
                );
              }}
            />
            <button
              className={`IDGenerator-setting-aspectRatio-button ${
                lockAspect ? "active" : ""
              }`}
              title="Lock Aspect Ratio"
              onClick={() => setLockAspect((prev) => !prev)}
              disabled={isDisabled}
            >
              <MDBIcon fas icon="expand" />
            </button>
          </div>

          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
            <Input
              type="number"
              title="Corner Radius"
              unit="%"
              label={<MDBIcon fas icon="stop" />}
              value={parseFloat(style.borderRadius) || 0}
              disabled={isDisabled}
              onChange={(e) =>
                updateStyle({ borderRadius: `${e.target.value}%` })
              }
            />
            {/* <Input
              type="number"
              title="Border"
              unit="px"
              label={
                <input
                  type="color"
                  value={style.border ? style.border.split(" ")[2] : "#000000"}
                  onChange={(e) =>
                    updateStyle({
                      border: `${parseInt(
                        style.border?.split(" ")[0] || 1
                      )}px solid ${e.target.value}`,
                    })
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                  disabled={isDisabled}
                />
              }
              value={style.border ? parseInt(style.border.split(" ")[0]) : 1}
              disabled={isDisabled}
              onChange={(e) =>
                updateStyle({
                  border: `${e.target.value}px solid ${
                    style.border ? style.border.split(" ")[2] : "#000000"
                  }`,
                })
              }
            /> */}
          </div>

          {/* <Input
            type="number"
            title="Opacity"
            label={<MDBIcon fas icon="adjust" />}
            value={style.opacity !== undefined ? style.opacity * 100 : 100}
            min={0}
            max={100}
            step={5}
            unit="%"
            disabled={isDisabled}
            onChange={(e) =>
              updateStyle({
                opacity: Math.min(1, Math.max(0, e.target.value / 100)),
              })
            }
          /> */}
        </div>
      )}

      {!isImage && (
        <div
          className={`IDGenerator-setting-section ${
            isDisabled ? "disabled" : ""
          }`}
        >
          {/* <Select
            label="Font Family"
            options={Object.entries(Fonts).map(([key, value]) => ({
              label: key,
              value,
            }))}
            getLabel={(opt) => opt.label}
            getValue={(opt) => opt.value}
            getStyle={(opt) => ({ fontFamily: opt.value })}
            showSearch
            disabled={isDisabled}
            onSelect={(val) => updateStyle({ fontFamily: val })}
          /> */}
          <div
            className="d-flex align-items-center mt-2"
            style={{ gap: "5px" }}
          >
            <Select
              label="Font Size"
              options={FontSizes.map((size) => ({
                label: `${size}px`,
                value: size,
              }))}
              getLabel={(opt) => opt.label}
              getValue={(opt) => opt.value}
              useInput
              disabled={isDisabled}
              onSelect={(val) => updateStyle({ fontSize: val })}
            />
            {/* <Select
              label="Font Weight"
              options={Object.entries(FontWeights).map(([key, val]) =>
                typeof val === "object"
                  ? { label: key, value: val.weight, style: val.style }
                  : { label: key, value: val, style: "normal" }
              )}
              getLabel={(opt) => opt.label}
              getValue={(opt) => opt}
              getStyle={(opt) => ({
                fontWeight: opt.value,
                fontStyle: opt.style,
              })}
              disabled={isDisabled}
              onSelect={(opt) =>
                updateStyle({ fontWeight: opt.value, fontStyle: opt.style })
              }
            /> */}
          </div>
          <div
            className="d-flex align-items-center mt-2"
            style={{ gap: "5px" }}
          >
            {/* <Input
              type="text"
              title="Font Color"
              label={
                <input
                  type="color"
                  style={{ border: "none" }}
                  value={
                    /^#([0-9A-F]{3}){1,2}$/i.test(style.color)
                      ? style.color
                      : toHex(style.color || "#000000")
                  }
                  onChange={(e) => updateStyle({ color: e.target.value })}
                  disabled={isDisabled}
                />
              }
              value={style.color || ""}
              disabled={isDisabled}
              onChange={(e) => updateStyle({ color: e.target.value })}
            /> */}
            <Input
              type="number"
              title="Letter Spacing"
              unit="px"
              label={<MDBIcon fas icon="text-width" />}
              value={parseInt(style.letterSpacing) || 0}
              disabled={isDisabled}
              onChange={(e) =>
                updateStyle({ letterSpacing: `${e.target.value}px` })
              }
            />
          </div>
        </div>
      )}

      <div className="IDGenerator-settings-navigation">
        <button onClick={handlePrev} disabled={activeIndex === 0}>
          Prev
        </button>
        <button
          onClick={handleNext}
          disabled={activeIndex >= collections.length - 1}
        >
          Next
        </button>
      </div>

      <div className="IDGenerator-settings-save">
        <button onClick={handleSave}>💾 Save</button>
      </div>
    </div>
  );
}
