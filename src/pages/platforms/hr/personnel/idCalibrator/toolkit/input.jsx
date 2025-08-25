import React, { useState, useEffect, useCallback } from "react";

export default function Input({
  label,
  type = "number",
  title,
  value,
  onChange,
  disabled,
  min,
  max,
  step,
}) {
  const [innerValue, setInnerValue] = useState(value || 0);

  useEffect(() => {
    setInnerValue(value || 0);
  }, [value]);

  // 🔹 Drag logic on label (scaled like % para hindi mabilis)
  const handleLabelMouseDown = useCallback(
    (e) => {
      e.preventDefault();

      const startX = e.clientX;
      const startValue = parseFloat(innerValue) || 0;
      const sensitivity = 0.05; // maliit na step (1px per 20px drag)

      // lock cursor globally
      document.documentElement.style.setProperty(
        "cursor",
        "ew-resize",
        "important"
      );
      document.body.style.userSelect = "none";
      document.body.style.pointerEvents = "none";
      e.currentTarget.style.pointerEvents = "auto";

      const handleMouseMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        // maliit ang increment para parang % ang dating
        let newValue = Math.round(startValue + deltaX * sensitivity);

        setInnerValue(newValue);
        onChange({ target: { value: newValue } });

        document.documentElement.style.setProperty(
          "cursor",
          "ew-resize",
          "important"
        );
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        document.documentElement.style.removeProperty("cursor");
        document.body.style.userSelect = "";
        document.body.style.pointerEvents = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [innerValue, onChange]
  );

  const inputId = title
    ? title.replace(/\s+/g, "-").toLowerCase()
    : `input-${type}`;

  return (
    <div className="IDGenerator-setting-input-container">
      {title && (
        <span
          className={`IDGenerator-setting-input-title ${
            disabled ? "disabled" : ""
          }`}
        >
          {title}
        </span>
      )}
      <div
        className={`IDGenerator-setting-input-wrapper ${
          disabled ? "disabled" : ""
        }`}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="IDGenerator-setting-label"
            onMouseDown={handleLabelMouseDown}
            style={{ cursor: "ew-resize" }}
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className="IDGenerator-setting-input"
          type={type}
          value={innerValue}
          onChange={(e) => {
            setInnerValue(e.target.value);
            onChange(e);
          }}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
