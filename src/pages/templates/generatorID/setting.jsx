import React, { useEffect } from "react";
import { Fonts, FontSizes, FontWeights } from "./fontStyle";
import Input from "./input";
import Select from "./select";
import { MDBIcon } from "mdbreact";

export default function Setting({
  placedValue,
  updatePosition,
  updateStyle,
  onNext,
  onPrev,
  currentIndex,
  total,
  onSave,
}) {
  useEffect(() => {
    if (!placedValue) return;

    const handleKeyDown = (e) => {
      let { x, y } = placedValue;
      const step = e.shiftKey ? 10 : 1;

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault();
          y -= step;
          break;
        case "ArrowDown":
          e.preventDefault();
          y += step;
          break;
        case "ArrowLeft":
          e.preventDefault();
          x -= step;
          break;
        case "ArrowRight":
          e.preventDefault();
          x += step;
          break;
        default:
          return;
      }
      updatePosition(x, y);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [placedValue, updatePosition]);

  if (!placedValue) return <div>Select a value on the image</div>;

  const fontWeightOptions = Object.entries(FontWeights).map(([key, weight]) => {
    const w = typeof weight === "object" ? weight.weight : weight;
    return { label: key, value: w };
  });

  const fontSizeOptions = Object.keys(FontSizes).map((size) => ({
    label: `${size}px`,
    value: Number(size),
  }));

  const isImage = placedValue.type === "image";

  return (
    <div className="IDGenerator-setting-container">
      {/* Position */}
      <div className="d-flex align-items-end" style={{ gap: "5px" }}>
        <Input
          label="X"
          type="number"
          title="alignment"
          value={placedValue.x}
          onChange={(e) =>
            updatePosition(Number(e.target.value), placedValue.y)
          }
        />
        <Input
          label="Y"
          type="number"
          value={placedValue.y}
          onChange={(e) =>
            updatePosition(placedValue.x, Number(e.target.value))
          }
        />
      </div>

      {isImage ? (
        <>
          {/* Image-specific settings */}
          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
            <Input
              type="number"
              title="Width"
              label={<MDBIcon fas icon="arrows-alt-h" />}
              value={placedValue.width || 100}
              onChange={(e) => updateStyle({ width: Number(e.target.value) })}
            />
            <Input
              type="number"
              title="Height"
              label={<MDBIcon fas icon="arrows-alt-v" />}
              value={placedValue.height || 100}
              onChange={(e) => updateStyle({ height: Number(e.target.value) })}
            />
          </div>
          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
            <Input
              type="number"
              title="Corner Radius"
              label={<MDBIcon fas icon="stop" />}
              value={placedValue.borderRadius || 0}
              onChange={(e) =>
                updateStyle({ borderRadius: Number(e.target.value) })
              }
            />
            <Input
              type="number"
              title="Border"
              label={
                <input
                  type="color"
                  value={placedValue.borderColor || "#000000"}
                  onChange={(e) => updateStyle({ borderColor: e.target.value })}
                  style={{
                    border: "none",
                    height: "25px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    padding: "0",
                  }}
                />
              }
              value={placedValue.border} // example: "2px solid #000"
              onChange={(e) => updateStyle({ border: e.target.value })}
            />
          </div>

          <Input
            type="number"
            title="opacity"
            label={<MDBIcon fas icon="adjust" />}
            value={placedValue.opacity !== undefined ? placedValue.opacity : 1}
            onChange={(e) => updateStyle({ opacity: Number(e.target.value) })}
            min={0}
            max={1}
            step={0.05}
          />
        </>
      ) : (
        <>
          {/* Text-specific settings */}
          <Select
            label="Font Family"
            options={Object.entries(Fonts).map(([key, value]) => ({
              label: key,
              value,
            }))}
            getLabel={(option) => option.label}
            getValue={(option) => option.value}
            getStyle={(option) => ({ fontFamily: option.value })}
            defaultValue={{
              label: placedValue.fontFamily || "Arial",
              value: placedValue.fontFamily || "Arial",
            }}
            onSelect={(value) => updateStyle({ fontFamily: value })}
          />
          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
            <Select
              label="Font Size"
              options={fontSizeOptions}
              getLabel={(option) => option.label}
              getValue={(option) => option.value}
              defaultValue={{
                label: `${placedValue.fontSize || 12}px`,
                value: placedValue.fontSize || 12,
              }}
              useInput={true}
              showSearch={false}
              onSelect={(value) => updateStyle({ fontSize: Number(value) })}
            />
            <Select
              label="Font Weight"
              options={fontWeightOptions}
              getLabel={(option) => option.label}
              getValue={(option) => option.value}
              getStyle={(option) => ({ fontWeight: option.value })}
              defaultValue={{
                label: Object.keys(FontWeights).find((k) => {
                  const w =
                    typeof FontWeights[k] === "object"
                      ? FontWeights[k].weight
                      : FontWeights[k];
                  return w === (placedValue.fontWeight || 400);
                }),
                value: placedValue.fontWeight || 400,
              }}
              onSelect={(value) => updateStyle({ fontWeight: Number(value) })}
              showSearch={false}
            />
          </div>
          <div className="d-flex align-items-center" style={{ gap: "5px" }}>
            <Input
              type="color"
              title="Font Color"
              label={<MDBIcon fas icon="palette" />}
              value={placedValue.color || "#000000"}
              onChange={(e) => updateStyle({ color: e.target.value })}
            />
            <Input
              type="number"
              title="Letter Spacing"
              label={<MDBIcon fas icon="text-width" />}
              value={placedValue.letterSpacing || 0}
              onChange={(e) =>
                updateStyle({ letterSpacing: Number(e.target.value) })
              }
            />
          </div>
        </>
      )}

      {/* 🔹 Navigation controls */}
      <div className="IDGenerator-settings-navigation">
        <button onClick={onPrev}>Prev</button>

        <button onClick={onNext}>Next</button>
      </div>

      {/* ✅ Save button */}
      <div className="IDGenerator-settings-save">
        <button onClick={onSave}>💾 Save</button>
      </div>
    </div>
  );
}
