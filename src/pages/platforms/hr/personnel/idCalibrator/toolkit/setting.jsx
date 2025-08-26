import React, { useEffect, useState } from "react";
import { Fonts, FontSizes, FontWeights, borderStyles } from "./fontStyle";
import { MDBIcon } from "mdbreact";
import Input from "./input";
import Select from "./select";

export default function Setting({
  setLayout,
  options,
  isPersonalize = false,
  onReset,
  isDisabled = false,
  selectedValue,
  onUpdateValueStyle,
}) {
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

  // 🔹 Converts any CSS color (e.g. "blue", "rgb(255,0,0)") to hex (#RRGGBB)
  function toHex(color) {
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = color;
    return ctx.fillStyle; // browser auto-converts to rgb/hex
  }

  return (
    <div className="IDGenerator-setting-container">
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
            onSelect={(val) => setLayout(val)}
            getLabel={(option) => option}
            getValue={(option) => option}
          />
          <button
            className="IDGenerator-setting-reset-button"
            onClick={onReset}
          >
            Reset Template
          </button>
        </div>
      )}

      {/* 🔹 Image Settings */}
      {showImg && (
        <div className="IDGenerator-setting-section">
          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
            <Input
              type="number"
              title="Width"
              label={<MDBIcon fas icon="arrows-alt-h" />}
              value={parseInt(style.width) || 100} // default 100
              disabled={imgDisabled}
              onChange={(e) => updateStyle({ width: `${e.target.value}px` })}
            />
            <Input
              type="number"
              title="Height"
              label={<MDBIcon fas icon="arrows-alt-v" />}
              value={parseInt(style.height) || 100}
              disabled={imgDisabled}
              onChange={(e) => updateStyle({ height: `${e.target.value}px` })}
            />
          </div>
          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
            <Input
              type="number"
              title="Corner Radius"
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
          <Input
            type="number"
            title="Opacity"
            label={<MDBIcon fas icon="adjust" />}
            value={style.opacity !== undefined ? style.opacity * 100 : 100} // 1 → 100%
            min={0}
            max={100}
            step={5}
            disabled={imgDisabled}
            onChange={(e) => {
              const val = Math.min(100, Math.max(0, e.target.value)); // clamp 0–100
              updateStyle({ opacity: val / 100 }); // 100% → 1
            }}
          />
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
            getLabel={(option) => option.label}
            getValue={(option) => option.value}
            getStyle={(option) => ({ fontFamily: option.value })}
            showSearch={true} // optional, may search
            onSelect={(val) => {
              // kung nag-type, val ay string ng font value
              updateStyle({ fontFamily: val });
            }}
          />

          <div
            className="d-flex align-items-center mt-2"
            style={{ gap: "5px" }}
          >
            <Select
              label="Font Size"
              options={FontSizes.map((size) => ({
                label: `${size}px`, // display lang sa UI
                value: size, // numeric value para sa style
              }))}
              getLabel={(option) => option.label}
              getValue={(option) => option.value}
              useInput={true} // para puwede rin mag-type
              showSearch={false} // kung ayaw mo ng search bar
              onSelect={(val) => {
                // numeric value na lang ang pinapasa
                updateStyle({ fontSize: val });
              }}
            />
            <Select
              label="Font Weight"
              options={Object.entries(FontWeights).map(([key, value]) => {
                if (typeof value === "object") {
                  return {
                    label: key,
                    value: value.weight,
                    style: value.style,
                  };
                }
                return { label: key, value, style: "normal" };
              })}
              getLabel={(option) => option.label}
              getValue={(option) => option}
              getStyle={(option) => ({
                fontWeight: option?.value,
                fontStyle: option?.style || "normal",
              })}
              onSelect={(option) => {
                updateStyle({
                  fontWeight: option.value,
                  fontStyle: option.style,
                });
              }}
              showSearch={false}
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
              label={<MDBIcon fas icon="text-width" />}
              value={parseInt(style.letterSpacing) || 0}
              onChange={(e) =>
                updateStyle({ letterSpacing: `${e.target.value}px` })
              }
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="IDGenerator-settings-save">
        <button disabled={imgDisabled && textDisabled}>💾 Save</button>
      </div>
    </div>
  );
}
