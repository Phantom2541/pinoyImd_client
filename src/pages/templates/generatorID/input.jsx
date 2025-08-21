import React from "react";

export default function Input({ label, type, title, value, onChange }) {
  return (
    <div className="d-flex align-items-start flex-column w-100">
      {title && (
        <span className="IDGenerator-setting-input-title">{title}</span>
      )}
      <div className="IDGenerator-setting-input-container">
        {label && <label className="IDGenerator-setting-label">{label}</label>}
        <input
          className="IDGenerator-setting-input"
          type={type}
          value={value || ""}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
