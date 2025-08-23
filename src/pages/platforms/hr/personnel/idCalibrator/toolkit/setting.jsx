import React, { useEffect, useState } from "react";
import { MDBIcon } from "mdbreact";
import Input from "./input";
import Select from "./select";

export default function Setting({
  setLayout,
  options,
  isPersonalize = false,
  isImg = false,
}) {
  const [personalize, setPersonalize] = useState(false);
  useEffect(() => {
    setPersonalize(isPersonalize);
  }, [isPersonalize]);
  return (
    <div className="IDGenerator-setting-container">
      {/* Layout */}
      {!personalize && (
        <div
          className="d-flex justify-content-center align-items-end"
          style={{ gap: "10px" }}
        >
          <Select
            label="Layout"
            options={options}
            defaultValue={options[0]} // optional, set initial value
            onSelect={(val) => setLayout(val)}
            getLabel={(option) => option} // for simple string options
            getValue={(option) => option}
          />
          <button className="IDGenerator-setting-reset-button">
            Reset Template
          </button>
        </div>
      )}
      {/* Position */}
      <div className="d-flex align-items-end" style={{ gap: "5px" }}>
        <Input label="X" type="number" value={0} />
        <Input label="Y" type="number" value={0} />
      </div>

      {/* Image-specific settings */}
      {isImg && (
        <>
          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
            <Input
              type="number"
              title="Width"
              label={<MDBIcon fas icon="arrows-alt-h" />}
              value={100}
            />
            <Input
              type="number"
              title="Height"
              label={<MDBIcon fas icon="arrows-alt-v" />}
              value={100}
            />
          </div>
          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
            <Input
              type="number"
              title="Corner Radius"
              label={<MDBIcon fas icon="stop" />}
              value={0}
            />
            <Input
              type="color"
              title="Border Color"
              value="#000000"
              label={
                <input
                  type="color"
                  value="#000000"
                  style={{
                    border: "none",
                    height: "25px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: "0",
                  }}
                />
              }
            />
          </div>
          <Input
            type="number"
            title="Opacity"
            label={<MDBIcon fas icon="adjust" />}
            value={1}
            min={0}
            max={1}
            step={0.05}
          />
        </>
      )}

      {/* Text-specific settings */}
      <Select label="Font Family" />
      <div className="d-flex align-items-center" style={{ gap: "5px" }}>
        <Select label="Font Size" />
        <Select label="Font Weight" />
      </div>
      <div className="d-flex align-items-center" style={{ gap: "5px" }}>
        <Input
          type="color"
          title="Font Color"
          label={<MDBIcon fas icon="palette" />}
          value="#000000"
        />
        <Input
          type="number"
          title="Letter Spacing"
          label={<MDBIcon fas icon="text-width" />}
          value={0}
        />
      </div>

      {/* Navigation controls */}
      {personalize && (
        <div className="IDGenerator-settings-navigation">
          <button>Prev</button>
          <button>Next</button>
        </div>
      )}

      {/* Save button */}
      <div className="IDGenerator-settings-save">
        <button>💾 Save</button>
      </div>
    </div>
  );
}
