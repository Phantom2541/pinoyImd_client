import React, { useState, useEffect, useCallback } from "react";

export default function Input({
  label,
  title,
  value,
  onChange,
  disabled,
  min,
  max,
  step,
  unit, // "px" | "%" | undefined
}) {
  const [innerValue, setInnerValue] = useState(value || "");
  const [focused, setFocused] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setInnerValue(value ?? "");
  }, [value]);

  // Clamp helper
  const clamp = (val) => {
    if (min != null && val < min) return min;
    if (max != null && val > max) return max;
    return val;
  };

  // 🔹 Drag logic
  const handleLabelMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      setIsActive(true);

      const startX = e.clientX;
      const startValue = parseFloat(innerValue) || 0;
      const sensitivity = 0.05;

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
        let newValue = Math.round(startValue + deltaX * sensitivity);
        newValue = clamp(newValue); // ✅ clamp only here
        setInnerValue(newValue);
        onChange({ target: { value: newValue } });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        setIsActive(false);
        document.documentElement.style.removeProperty("cursor");
        document.body.style.userSelect = "";
        document.body.style.pointerEvents = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [innerValue, onChange, min, max]
  );

  const inputId = title
    ? title.replace(/\s+/g, "-").toLowerCase()
    : `input-number`;

  // Display with unit
  const formatValue = () => {
    if (focused) return innerValue;
    if (innerValue === "" || isNaN(innerValue)) return "";
    return unit ? `${innerValue}${unit}` : innerValue;
  };

  // Parse input
  const parseValue = (val) =>
    parseFloat(String(val).replace(unit || "", "")) || 0;

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
            className={`IDGenerator-setting-label ${isActive ? "active" : ""}`}
            onMouseDown={handleLabelMouseDown}
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className="IDGenerator-setting-input"
          type="text" // kailangan text para gumana ang unit
          value={formatValue()}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            const raw = parseValue(e.target.value);
            const clamped = clamp(raw);
            setInnerValue(clamped);
            onChange({ target: { value: clamped } });
          }}
          onChange={(e) => {
            // 👉 dito walang clamp para pwede burahin kahit min
            const raw = parseValue(e.target.value);
            setInnerValue(e.target.value); // allow temporary string
            onChange({ target: { value: raw } });
          }}
          step={step}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
