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
  unit, // 🔹 new prop: "px" | "%" | undefined
}) {
  const [innerValue, setInnerValue] = useState(value || 0);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    setInnerValue(value || 0);
  }, [value]);

  // 🔹 Drag logic (unchanged)
  const [isActive, setIsActive] = useState(false);

  const handleLabelMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      setIsActive(true); // ✅ Set active state

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
        setInnerValue(newValue);
        onChange({ target: { value: newValue } });
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);

        setIsActive(false); // ✅ Remove active state
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

  // 🔹 Format display value based on focus + unit
  const formatValue = () => {
    if (!unit) return innerValue; // no unit → plain
    return focused ? innerValue : `${innerValue}${unit}`;
  };

  // 🔹 Parse raw input (strip unit if needed)
  const parseValue = (val) => {
    return parseFloat(String(val).replace(unit || "", "")) || 0;
  };

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
          type="text" // text para pwede maglagay ng "px"/"%"
          value={formatValue()}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            setFocused(false);
            const raw = parseValue(e.target.value);
            let clamped = Math.min(max ?? raw, Math.max(min ?? raw, raw));
            setInnerValue(clamped);
            onChange({ target: { value: clamped } });
          }}
          onChange={(e) => {
            const raw = parseValue(e.target.value);
            setInnerValue(raw);
            onChange({ target: { value: raw } });
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
