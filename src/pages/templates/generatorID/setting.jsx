import React, { useEffect } from "react";
import { MDBIcon } from "mdbreact";
import { Fonts, FontSizes, FontWeights } from "./fontStyle";
import Input from "./input";
import Select from "./select";
import html2canvas from "html2canvas";

export default function Setting({
  onPrev,
  onNext,
  disablePrev,
  disableNext,
  selectedField,
  student,
  fieldStyles = {},
  setFieldStyles = () => {},
  positions = {},
  setPositions = () => {},
  setStudent,
  frontRef, // <- accept ref
  backRef, // <- accept ref
}) {
  const handleSave = () => {
    if (!frontRef.current) return;

    html2canvas(frontRef.current, { scale: 2 }).then((canvas) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "front-id.png";
        a.click();
        URL.revokeObjectURL(url);
      });
    });
  };

  // --- Ctrl+S shortcut ---
  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [frontRef, backRef, fieldStyles, positions, student]);

  if (!selectedField) {
    return (
      <div className="IDGenerator-setting-container">
        <p style={{ padding: "10px" }}>
          Select a field on the ID to edit its settings.
        </p>
        <div
          className="d-flex align-items-center justify-content-center mt-2"
          style={{ gap: "10px" }}
        >
          <button
            className="IDGenerator-setting-prev"
            onClick={onPrev}
            disabled={disablePrev}
          >
            Prev
          </button>
          <button
            className="IDGenerator-setting-next"
            onClick={onNext}
            disabled={disableNext}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  const style = fieldStyles[selectedField] || {};
  const pos = positions[selectedField] || { x: 0, y: 0 };
  const value = student ? student[selectedField] : "";

  const handleStyleChange = (key, value) => {
    if (key === "fontWeight") {
      const selected = FontWeights[value];
      setFieldStyles({
        ...fieldStyles,
        [selectedField]: {
          ...style,
          fontWeight: typeof selected === "object" ? selected.weight : selected,
          fontStyle: typeof selected === "object" ? selected.style : "normal",
        },
      });
    } else {
      setFieldStyles({
        ...fieldStyles,
        [selectedField]: {
          ...style,
          [key]: value,
        },
      });
    }
  };

  const handlePositionChange = (axis, value) => {
    setPositions({
      ...positions,
      [selectedField]: {
        ...pos,
        [axis]: Number(value),
      },
    });
  };

  return (
    <div className="IDGenerator-setting-container">
      {/* Position */}
      <div className="IDGenerator-setting-section">
        <label className="IDGenerator-setting-section-label">Position</label>
        <div className="IDGenerator-setting-inputs-wrapper">
          <div className="d-flex" style={{ gap: "10px" }}>
            <Input
              type="number"
              label="X"
              value={pos.x}
              onChange={(e) => handlePositionChange("x", e.target.value)}
            />
            <Input
              type="number"
              label="Y"
              value={pos.y}
              onChange={(e) => handlePositionChange("y", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="IDGenerator-setting-section mt-2">
        <label className="IDGenerator-setting-section-label">Typography</label>
        <div className="IDGenerator-setting-inputs-wrapper">
          <Select
            label="Font Family"
            options={Object.keys(Fonts)}
            getLabel={(key) => key}
            getValue={(key) => key}
            getStyle={(key) => ({ fontFamily: key })}
            defaultValue={style.fontFamily || "Inter"}
            onSelect={(value) => handleStyleChange("fontFamily", value)}
          />
          <div className="d-flex w-100" style={{ gap: "10px" }}>
            <Select
              label="Font Size"
              options={Object.keys(FontSizes)}
              getLabel={(size) => size}
              getValue={(size) => size}
              useInput={true}
              showSearch={false}
              defaultValue={style.fontSize || "12px"}
              onSelect={(value) => handleStyleChange("fontSize", value + "px")}
            />
            <Select
              label="Font Weight"
              options={Object.keys(FontWeights)}
              getLabel={(w) => w}
              getValue={(w) => w}
              defaultValue={style.fontWeight || "normal"}
              onSelect={(value) => handleStyleChange("fontWeight", value)}
            />
          </div>
          <div className="d-flex" style={{ gap: "10px" }}>
            <Input
              title="Letter Spacing"
              type="number"
              value={parseFloat(style.letterSpacing) || 0}
              onChange={(e) =>
                handleStyleChange("letterSpacing", e.target.value + "px")
              }
              label={<MDBIcon fas icon="text-width" />}
            />
            <Input
              title="Text Color"
              type="color"
              value={style.color || "#000000"}
              onChange={(e) => handleStyleChange("color", e.target.value)}
            />
          </div>
          <div className="d-flex" style={{ gap: "10px" }}>
            <Input
              title="Opacity"
              type="number"
              min={0}
              max={100}
              value={style.opacity !== undefined ? style.opacity * 100 : ""}
              onChange={(e) =>
                handleStyleChange(
                  "opacity",
                  e.target.value === "" ? undefined : e.target.value / 100
                )
              }
              onBlur={(e) => {
                if (!e.target.value || e.target.value === "0")
                  handleStyleChange("opacity", 1);
              }}
              label={<MDBIcon fas icon="adjust" />}
            />
            <Input
              title="Line"
              type="number"
              value={style.lineWidth || 0}
              onChange={(e) =>
                handleStyleChange("lineWidth", Number(e.target.value))
              }
              label={
                <input
                  type="color"
                  className="IDGenerator-setting-inputColor"
                  value={style.lineColor || "#000000"}
                  onChange={(e) =>
                    handleStyleChange("lineColor", e.target.value)
                  }
                />
              }
            />
          </div>
        </div>

        {/* Permanent Edit */}
        <div className="mt-2">
          <Input
            title="Edit"
            type="textarea"
            value={
              selectedField === "fullName"
                ? `${student.firstName} ${student.lastName}`
                : student[selectedField] || ""
            }
            onChange={(e) => {
              if (!student) return;

              let updated;
              if (selectedField === "fullName") {
                const names = e.target.value.split(" ");
                updated = {
                  ...student,
                  firstName: names[0] || "",
                  lastName: names.slice(1).join(" ") || "",
                };
              } else {
                updated = { ...student, [selectedField]: e.target.value };
              }

              setStudent(updated);
            }}
            label={<MDBIcon fas icon="pencil-alt" />}
          />
        </div>
      </div>

      {/* Navigation */}
      <div
        className="d-flex align-items-center justify-content-center mt-2"
        style={{ gap: "10px" }}
      >
        <button
          className="IDGenerator-setting-prev"
          onClick={onPrev}
          disabled={disablePrev}
        >
          Prev
        </button>
        <button
          className="IDGenerator-setting-next"
          onClick={onNext}
          disabled={disableNext}
        >
          Next
        </button>
      </div>

      <button
        className="IDGenerator-setting-save bg-primary mt-2"
        onClick={handleSave}
      >
        Save
      </button>
    </div>
  );
}
