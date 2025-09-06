import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setLayout,
  setSelectedValue,
  setLockAspect,
  setEditMode,
} from "../../../../../../services/redux/slices/idCard/calibrator";
import { Fonts, FontSizes, FontWeights } from "./fontStyle";
import { MDBIcon } from "mdbreact";
import Input from "./input";
import Select from "./select";

const options = ["portrait", "landscape"];

export default function Setting({
  isPersonalize = false,
  onReset,
  onUpdateValueStyle,
  onSave,

  lockAspectRatio,
  placedValues,
}) {
  const { frontImage, backImage, selectedValue, lockAspect, editMode } =
      useSelector(({ idCalibrator }) => idCalibrator),
    dispatch = useDispatch();
  const [personalize, setPersonalize] = useState(false);
  const [lastSelectedType, setLastSelectedType] = useState(null);

  useEffect(() => {
    setPersonalize(isPersonalize);
  }, [isPersonalize]);

  // Update lastSelectedType kapag may selection
  useEffect(() => {
    if (selectedValue) {
      const val = selectedValue.value;
      if (
        val &&
        typeof val === "string" &&
        val.match(/\.(jpeg|jpg|gif|png|svg)$/i)
      ) {
        setLastSelectedType("img");
      } else {
        setLastSelectedType("text");
      }
    }
  }, [selectedValue]);

  const style = selectedValue?.style || {};
  const hasSelection = !!selectedValue;

  // Show/hide logic
  const showImg = lastSelectedType === "img";
  const showText =
    lastSelectedType === "text" || (!lastSelectedType && !hasSelection);

  // Disabled logic
  const imgDisabled = !hasSelection || lastSelectedType !== "img";
  const textDisabled = !hasSelection || lastSelectedType !== "text";

  const updateStyle = (changes) => {
    if (typeof onUpdateValueStyle === "function") {
      onUpdateValueStyle(changes);
    }
  };

  // inside Setting component
  const isQR = selectedValue?.key === "qr";

  useEffect(() => {
    if (isQR) {
      dispatch(setLockAspect(true)); // auto lock kapag QR
    }
  }, [isQR, dispatch]);

  // 🔹 Converts any CSS color (e.g. "blue", "rgb(255,0,0)") to hex (#RRGGBB)
  function toHex(color) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = color;
    return ctx.fillStyle; // browser auto-converts to rgb/hex
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (!selectedValue) return;

      let updated = {};

      // Arrow keys
      let delta = 1;
      if (e.shiftKey) delta = 5;
      switch (e.key) {
        case "ArrowUp":
          updated.y = selectedValue.y - delta;
          e.preventDefault();
          break;
        case "ArrowDown":
          updated.y = selectedValue.y + delta;
          e.preventDefault();
          break;
        case "ArrowLeft":
          updated.x = selectedValue.x - delta;
          e.preventDefault();
          break;
        case "ArrowRight":
          updated.x = selectedValue.x + delta;
          e.preventDefault();
          break;
        default:
          break;
      }

      // Font size / Image size shortcuts
      if (e.ctrlKey) {
        if (lastSelectedType === "text") {
          if (e.key === "[") {
            const currentSize = parseInt(selectedValue.style.fontSize) || 16;
            updated.fontSize = Math.max(1, currentSize - 1);
            e.preventDefault();
          } else if (e.key === "]") {
            const currentSize = parseInt(selectedValue.style.fontSize) || 16;
            updated.fontSize = currentSize + 1;
            e.preventDefault();
          }
        } else if (lastSelectedType === "img") {
          const currentWidth = parseInt(selectedValue.style.width) || 100;
          const currentHeight = parseInt(selectedValue.style.height) || 100;

          if (e.key === "[") {
            updated.width = Math.max(1, currentWidth - 1);
            updated.height = Math.max(1, currentHeight - 1);
            e.preventDefault();
          } else if (e.key === "]") {
            updated.width = currentWidth + 1;
            updated.height = currentHeight + 1;
            e.preventDefault();
          }
        }
      }
      // Aspect Ratio Lock
      if (e.ctrlKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        if (!imgDisabled) dispatch(setLockAspect(!lockAspect));
      }

      // 🔹 Tab navigation
      if (e.key === "Tab") {
        e.preventDefault();
        const allValues = Object.values(placedValues);
        const currentIndex = allValues.findIndex(
          (v) => v.id === selectedValue.id
        );
        const nextIndex = (currentIndex + 1) % allValues.length;
        dispatch(
          setSelectedValue({ ...allValues[nextIndex], index: nextIndex })
        );
        return; // tapos na dito
      }

      if (Object.keys(updated).length > 0) {
        updateStyle(updated);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedValue, placedValues, updateStyle]);

  const weightOptions = Object.entries(FontWeights).map(([key, value]) =>
    typeof value === "object"
      ? { label: key, value: value.weight, style: value.style }
      : { label: key, value, style: "normal" }
  );

  const currentWeight = parseInt(style.fontWeight, 10) || 400;

  const selectedOption = weightOptions.find(
    (o) => o.value === currentWeight
  ) || { label: "regular", value: 400, style: "normal" };

  return (
    <div
      className={`IDGenerator-setting-container ${editMode ? "show" : "hide"}`}
    >
      {/* Layout controls */}
      {!personalize && (
        <div
          className="d-flex justify-content-center align-items-end"
          style={{ gap: "10px" }}
        >
          <Select
            label="Layout"
            options={options}
            defaultValue={options[0]}
            onSelect={(val) => dispatch(setLayout(val))}
            getLabel={(option) => option}
            getValue={(option) => option}
            showSearch={false}
          />
          <button
            className="IDGenerator-setting-reset-button"
            onClick={onReset}
          >
            Reset Template
          </button>
          <div
            className={`id-calibrator-edit-button ${editMode ? "" : "hide"}`}
          >
            <button
              onClick={() => dispatch(setEditMode(false))}
              className="bg-secondary"
            >
              Hide Setting
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Image Settings */}
      {showImg && (
        <div className="IDGenerator-setting-section">
          <div className="d-flex align-items-end" style={{ gap: "5px" }}>
            <Input
              type="number"
              title="Width"
              unit="px"
              label={<MDBIcon fas icon="arrows-alt-h" />}
              value={parseInt(style.width)}
              disabled={imgDisabled}
              onChange={(e) => {
                const newWidth = parseInt(e.target.value, 10) || 0;
                const currentHeight = parseFloat(style.height) || 100;
                const aspectRatio =
                  (parseFloat(style.width) || 100) / currentHeight;

                const { width, height } = lockAspectRatio(
                  newWidth,
                  currentHeight,
                  lockAspect,
                  aspectRatio,
                  "width"
                );

                updateStyle({ width, height });
              }}
            />

            <Input
              type="number"
              title="Height"
              unit="px"
              label={<MDBIcon fas icon="arrows-alt-v" />}
              value={parseInt(style.height)}
              disabled={imgDisabled}
              onChange={(e) => {
                const newHeight = parseInt(e.target.value, 10) || 0;
                const currentWidth = parseFloat(style.width) || 100;
                const aspectRatio =
                  currentWidth / (parseFloat(style.height) || 100);

                const { width, height } = lockAspectRatio(
                  currentWidth,
                  newHeight,
                  lockAspect,
                  aspectRatio,
                  "height"
                );

                updateStyle({ width, height });
              }}
            />

            <button
              className={`IDGenerator-setting-aspectRatio-button ${
                lockAspect ? "active" : ""
              }`}
              title="Lock Aspect Ratio"
              onClick={() => {
                if (!isQR) dispatch(setLockAspect(!lockAspect));
              }}
              disabled={imgDisabled || isQR} // 🚫 bawal i-off kapag QR
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
              value={parseInt(style.borderRadius) || 0}
              disabled={imgDisabled}
              onChange={(e) =>
                updateStyle({ borderRadius: `${e.target.value}px` })
              }
            />
            <Input
              type="number"
              title="Border"
              unit="px"
              label={
                <input
                  type="color"
                  value={
                    style.border
                      ? style.border.split(" ")[2] // extract color
                      : "#000000"
                  }
                  onChange={(e) =>
                    updateStyle({
                      border: `${
                        parseInt(style.border?.split(" ")[0]) || 1
                      }px solid ${e.target.value}`,
                    })
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                />
              }
              value={
                style.border
                  ? parseInt(style.border.split(" ")[0]) // extract px
                  : 1
              }
              disabled={imgDisabled}
              onChange={(e) =>
                updateStyle({
                  border: `${e.target.value}px solid ${
                    style.border ? style.border.split(" ")[2] : "#000000"
                  }`,
                })
              }
            />
          </div>
          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
            <Input
              type="number"
              title="Opacity"
              label={<MDBIcon fas icon="adjust" />}
              value={style.opacity !== undefined ? style.opacity * 100 : 100} // 1 → 100%
              min={0}
              max={100}
              step={5}
              unit="%"
              disabled={imgDisabled}
              onChange={(e) => {
                const raw = parseFloat(e.target.value) || 0;
                const val = Math.min(100, Math.max(0, raw)); // clamp 0–100
                updateStyle({ opacity: val / 100 }); // 100% → 1
              }}
            />
            <Input
              type="number"
              title="Rotate"
              unit="°"
              label={<i class="fas fa-rotate"></i>}
              value={
                style.transform
                  ? parseInt(style.transform.replace(/[^0-9\\-]/g, "")) // extract degrees
                  : 0
              }
              disabled={imgDisabled}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 0;
                updateStyle({ transform: `rotate(${val}deg)` });
              }}
            />
          </div>
        </div>
      )}

      {/* 🔹 Text Settings */}
      {showText && (
        <div
          className={`IDGenerator-setting-section ${
            textDisabled ? "disabled" : ""
          }`}
          data-label={`${selectedValue?.key || ""} setting`}
        >
          <Select
            label="Font Family"
            options={Object.entries(Fonts).map(([key, value]) => ({
              label: key,
              value,
            }))}
            value={{
              label:
                Object.keys(Fonts).find(
                  (key) => Fonts[key] === style.fontFamily
                ) || "inter",
              value: style.fontFamily || Fonts.inter,
            }}
            getLabel={(option) => option.label}
            getValue={(option) => option.value}
            getStyle={(option) => ({ fontFamily: option?.value })}
            showSearch
            onSelect={(val) => updateStyle({ fontFamily: val })}
          />

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
              value={{
                label: `${parseInt(style.fontSize) || 16}px`,
                value: parseInt(style.fontSize) || 16,
              }}
              getLabel={(option) => option.label}
              getValue={(option) => option.value}
              useInput
              showSearch={false}
              onSelect={(val) => updateStyle({ fontSize: `${val}px` })}
            />

            <Select
              label="Font Weight"
              options={weightOptions}
              value={selectedOption} // <-- controlled na tama
              getLabel={(option) => option?.label || String(option)}
              getValue={(option) => option.value}
              getStyle={(option) => ({
                fontWeight: option?.value,
                fontStyle: option?.style || "normal",
              })}
              onSelect={(val, option) =>
                updateStyle({
                  fontWeight: val,
                  fontStyle: option?.style || "normal",
                })
              }
            />
          </div>

          <div
            className="d-flex align-items-center mt-2"
            style={{ gap: "5px" }}
          >
            <Input
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
                />
              }
              value={style.color || ""}
              onChange={(e) => {
                const val = e.target.value;
                updateStyle({ color: val });
              }}
            />

            <Input
              type="number"
              title="Letter Spacing"
              unit="%"
              label={<MDBIcon fas icon="text-width" />}
              value={parseInt(style.letterSpacing) || 0}
              onChange={(e) =>
                updateStyle({ letterSpacing: `${e.target.value}px` })
              }
            />
          </div>
          <div
            className="d-flex align-items-center mt-2"
            style={{ gap: "5px" }}
          >
            <Input
              type="number"
              title="Opacity"
              label={<MDBIcon fas icon="adjust" />}
              value={style.opacity !== undefined ? style.opacity * 100 : 100} // 1 → 100%
              min={0}
              max={100}
              step={5}
              unit="%"
              onChange={(e) => {
                const raw = parseFloat(e.target.value) || 0;
                const val = Math.min(100, Math.max(0, raw)); // clamp 0–100
                updateStyle({ opacity: val / 100 }); // 100% → 1
              }}
            />
            <Input
              type="number"
              title="Text Underline"
              unit="px"
              label={
                <input
                  type="color"
                  value={
                    style.borderBottom
                      ? style.borderBottom.split(" ")[2] // extract color
                      : "#000000"
                  }
                  onChange={(e) =>
                    updateStyle({
                      borderBottom: `${
                        parseInt(style.borderBottom?.split(" ")[0]) || 1
                      }px solid ${e.target.value}`,
                    })
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                  }}
                />
              }
              value={
                style.borderBottom
                  ? parseInt(style.borderBottom.split(" ")[0]) // extract px
                  : 0
              }
              onChange={(e) =>
                updateStyle({
                  borderBottom: `${e.target.value}px solid ${
                    style.borderBottom
                      ? style.borderBottom.split(" ")[2]
                      : "#000000"
                  }`,
                })
              }
            />
          </div>
        </div>
      )}

      <div className="IDGenerator-settings-upload">
        <label
          className={frontImage ? "active" : ""}
          htmlFor={`uploadimgfront`}
        >
          Change Front
        </label>
        <label className={backImage ? "active" : ""} htmlFor={`uploadimgback`}>
          Change Back
        </label>
      </div>

      {/* Save Button */}
      <div className="IDGenerator-settings-save">
        <button onClick={onSave}>💾 SAVE</button>
      </div>
    </div>
  );
}
