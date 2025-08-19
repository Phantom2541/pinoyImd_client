import React from "react";
import idSizes from "./preset";

export default function Header({
  selectedSize,
  setSelectedSize,
  setMode,
  mode,
}) {
  return (
    <div className="generatorID-header">
      <span className="generatorID-header-title">ID Generator</span>
      <div className="generatorID-header-options">
        <select
          className="generatorID-header-select"
          value={selectedSize.name}
          onChange={(e) =>
            setSelectedSize(idSizes.find((s) => s.name === e.target.value))
          }
        >
          {idSizes.map((size, i) => (
            <option key={i} value={size.name}>
              {size.name} – {size.width}×{size.height}
              {size.unit}
            </option>
          ))}
        </select>

        <button
          className={`generatorID-header-btn ${
            mode === "text" ? "active" : ""
          }`}
          onClick={() => setMode("text")}
        >
          Add Text
        </button>

        <button
          className={`generatorID-header-btn ${
            mode === "line" ? "active" : ""
          }`}
          onClick={() => setMode("line")}
        >
          Add Line
        </button>
        <button
          className={`generatorID-header-btn ${
            mode === "rect" ? "active" : ""
          }`}
          onClick={() => setMode("rect")}
        >
          Add Rect
        </button>
        <button className="generatorID-header-btn">Add Circle</button>
        <button className="generatorID-header-btn">Add Image</button>
        <button className="generatorID-header-exportBtn">Export PNG</button>
      </div>
    </div>
  );
}
