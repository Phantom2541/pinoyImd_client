import React from "react";
import {
  Fonts,
  FontSizes,
  FontWeights,
} from "./../idCalibrator/toolkit/fontStyle";
import { MDBIcon } from "mdbreact";
import Input from "./../idCalibrator/toolkit/input";
import Select from "./../idCalibrator/toolkit/select";

export default function Setting({ setLayout, options }) {
  const style = {};

  return (
    <div className="IDGenerator-setting-container">
      <div
        className="d-flex justify-content-center align-items-end"
        style={{ gap: "10px" }}
      >
        <Select label="Layout" />
        <button className="IDGenerator-setting-reset-button">
          Reset Template
        </button>
      </div>

      <div className="IDGenerator-setting-section">
        <div className="d-flex align-items-end" style={{ gap: "5px" }}>
          <Input
            type="number"
            title="Width"
            unit="px"
            label={<MDBIcon fas icon="arrows-alt-h" />}
          />
          <Input
            type="number"
            title="Height"
            unit="px"
            label={<MDBIcon fas icon="arrows-alt-v" />}
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
          />
          <Input type="number" title="Border" unit="px" value={style.border} />
        </div>
        <Input
          type="number"
          title="Opacity"
          label={<MDBIcon fas icon="adjust" />}
          unit="%"
        />
      </div>

      <div className="IDGenerator-setting-section">
        <Select
          label="Font Family"
          options={Object.entries(Fonts).map(([key, value]) => ({
            label: key,
            value,
          }))}
          getLabel={(o) => o.label}
          getValue={(o) => o.value}
          getStyle={(o) => ({ fontFamily: o.value })}
        />
        <div className="d-flex align-items-center mt-2" style={{ gap: "5px" }}>
          <Select
            label="Font Size"
            options={FontSizes.map((size) => ({
              label: `${size}px`,
              value: size,
            }))}
            getLabel={(o) => o.label}
            getValue={(o) => o.value}
          />
          <Select
            label="Font Weight"
            options={Object.entries(FontWeights).map(([key, value]) => ({
              label: key,
              value,
            }))}
            getLabel={(o) => o.label}
            getValue={(o) => o.value}
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

      <div className="IDGenerator-settings-save">
        <button>Save</button>
      </div>
    </div>
  );
}
