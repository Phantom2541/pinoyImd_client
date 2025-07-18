import React from "react";
import "./style.css";

/**
 * Loader component with size and style support.
 *
 * @param {number} progress - Progress (0–100)
 * @param {string} displayType - "circle", "bar", "segmented-bar"
 * @param {string} color - Progress color
 * @param {string} size - "sm", "md", "l", "xl"
 */
export default function Loader({
  progress = 0,
  displayType = "circle",
  color = "#3498db",
  size = "md",
}) {
  const sizeMap = {
    sm: 60,
    md: 100,
    l: 140,
    xl: 180,
  };

  const diameter = sizeMap[size] || 100;
  const radius = diameter / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  if (displayType === "bar") {
    return (
      <div className={`template-bar-container template-bar-${size}`}>
        <div
          className="template-bar-fill"
          style={{ width: `${progress}%`, backgroundColor: color }}
        ></div>
        <div
          className={`template-bar-text template-text-${size}`}
          style={{ color: progress >= 50 ? "white" : "black" }}
        >
          {progress >= 100 ? "Download Complete" : `${progress}%`}
        </div>
      </div>
    );
  }

  if (displayType === "segmented-bar") {
    const segments = 20;
    const filled = Math.round((progress / 100) * segments);

    return (
      <div className={`template-segmented-wrapper template-segmented-${size}`}>
        <div className="template-segmented-container">
          {[...Array(segments)].map((_, i) => (
            <div
              key={i}
              className="template-segment"
              style={{
                backgroundColor: i < filled ? color : "#ccc",
              }}
            ></div>
          ))}
        </div>
        <div className={`template-segmented-text template-text-${size}`}>
          {progress >= 100 ? "Download Complete" : `${progress}%`}
        </div>
      </div>
    );
  }

  // Circle loader
  if (size === "sm") {
    return (
      <div
        className="template-circle-wrapper"
        style={{ width: diameter, textAlign: "center" }}
      >
        <div
          className="template-progress-container"
          style={{ width: diameter, height: diameter }}
        >
          <svg
            className="template-progress-ring"
            width={diameter}
            height={diameter}
          >
            <circle
              stroke="#e0e0e0"
              strokeWidth="5"
              fill="transparent"
              r={radius}
              cx={diameter / 2}
              cy={diameter / 2}
            />
            <circle
              className="template-progress-ring__circle"
              stroke={color}
              strokeWidth="5"
              fill="transparent"
              r={radius}
              cx={diameter / 2}
              cy={diameter / 2}
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: offset,
              }}
            />
          </svg>
        </div>
        <div className="template-progress-text-outside">
          {progress >= 100 ? "Download Complete" : `${progress}%`}
        </div>
      </div>
    );
  }

  // Circle loader for md, l, xl
  return (
    <div
      className="template-progress-container"
      style={{ width: diameter, height: diameter }}
    >
      <svg
        className="template-progress-ring"
        width={diameter}
        height={diameter}
      >
        <circle
          stroke="#e0e0e0"
          strokeWidth="5"
          fill="transparent"
          r={radius}
          cx={diameter / 2}
          cy={diameter / 2}
        />
        <circle
          className="template-progress-ring__circle"
          stroke={color}
          strokeWidth="5"
          fill="transparent"
          r={radius}
          cx={diameter / 2}
          cy={diameter / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className={`template-progress-text template-text-${size}`}>
        {progress >= 100 ? "Download Complete" : `${progress}%`}
      </div>
    </div>
  );
}
