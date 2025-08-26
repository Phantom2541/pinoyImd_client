import React from "react";
import {
  Fonts,
  FontSizes,
  FontWeights,
} from "./../idCalibrator/toolkit/fontStyle";
import { MDBIcon } from "mdbreact";
import Input from "./../idCalibrator/toolkit/input";
import Select from "./../idCalibrator/toolkit/select";

export default function Setting({
  setLayout,
  options,
  onReset,
  selectedValue,
  onSave,
}) {
  const style = selectedValue?.style || {};

  return (
    <div className="IDGenerator-setting-container">
      {/* Layout controls */}
      <div
        className="d-flex justify-content-center align-items-end"
        style={{ gap: "10px" }}
      >
        <Select
          label="Layout"
          options={options}
          defaultValue={options[0]}
          getLabel={(option) => option}
          getValue={(option) => option}
          showSearch={false}
        />
        <button className="IDGenerator-setting-reset-button" onClick={onReset}>
          Reset Template
        </button>
      </div>

      {/* Image Settings */}
      <div className="IDGenerator-setting-section">
        <div className="d-flex align-items-end" style={{ gap: "5px" }}>
          <Input
            type="number"
            title="Width"
            unit="px"
            label={<MDBIcon fas icon="arrows-alt-h" />}
            value={style.width}
          />
          <Input
            type="number"
            title="Height"
            unit="px"
            label={<MDBIcon fas icon="arrows-alt-v" />}
            value={style.height}
          />
          <button className="IDGenerator-setting-aspectRatio-button">
            <MDBIcon fas icon="expand" />
          </button>
        </div>
        <div className="d-flex align-items-center" style={{ gap: "5px" }}>
          <Input
            type="number"
            title="Corner Radius"
            unit="%"
            label={<MDBIcon fas icon="stop" />}
            value={style.borderRadius}
          />
          <Input type="number" title="Border" unit="px" value={style.border} />
        </div>
        <Input
          type="number"
          title="Opacity"
          label={<MDBIcon fas icon="adjust" />}
          value={style.opacity}
          min={0}
          max={100}
          step={5}
          unit="%"
        />
      </div>

      {/* Text Settings */}
      <div className="IDGenerator-setting-section">
        <Select
          label="Font Family"
          options={Object.entries(Fonts).map(([key, value]) => ({
            label: key,
            value,
          }))}
          getLabel={(option) => option.label}
          getValue={(option) => option.value}
          getStyle={(option) => ({ fontFamily: option.value })}
        />

        <div className="d-flex align-items-center mt-2" style={{ gap: "5px" }}>
          <Select
            label="Font Size"
            options={FontSizes.map((size) => ({
              label: `${size}px`,
              value: size,
            }))}
            getLabel={(option) => option.label}
            getValue={(option) => option.value}
          />
          <Select
            label="Font Weight"
            options={Object.entries(FontWeights).map(([key, value]) => {
              if (typeof value === "object")
                return { label: key, value: value.weight, style: value.style };
              return { label: key, value, style: "normal" };
            })}
            getLabel={(option) => option.label}
            getValue={(option) => option}
            getStyle={(option) => ({
              fontWeight: option?.value,
              fontStyle: option?.style || "normal",
            })}
          />
        </div>

        <div className="d-flex align-items-center mt-2" style={{ gap: "5px" }}>
          <Input type="text" title="Font Color" value={style.color || ""} />
          <Input
            type="number"
            title="Letter Spacing"
            unit="%"
            value={style.letterSpacing || 0}
            label={<MDBIcon fas icon="text-width" />}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="IDGenerator-settings-save">
        <button>{onSave ? "💾 Save" : "Save"}</button>
      </div>
    </div>
  );
}
