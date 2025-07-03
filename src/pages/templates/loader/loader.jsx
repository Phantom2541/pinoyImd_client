import React from "react";
import "./style.css";

/**
 * Loader component that displays a loading indicator in various styles.
 *
 * @param {number} progress - The current progress value (0 to 100).
 * @param {string} displayType  - The style of the loader ("circle", "bar", or "segmented-bar").
 * @param {string} color - The color of the progress indicator.
 * @returns {JSX.Element} A JSX element representing the loader.
 */

export default function Loader({
  progress = 0,
  displayType = "circle",
  color = "#3498db",
}) {
  if (displayType === "bar") {
    return (
      <div className="template-bar-container">
        <div
          className="template-bar-fill"
          style={{ width: `${progress}%`, backgroundColor: color }}
        ></div>
        <div
          className="template-bar-text"
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
      <div className="template-segmented-wrapper">
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
        <div className="template-segmented-text">
          {progress >= 100 ? "Download Complete" : `${progress}%`}
        </div>
      </div>
    );
  }

  // Default: Circle
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress / 100);

  return (
    <div className="template-progress-container">
      <svg className="template-progress-ring" width="120" height="120">
        <circle
          stroke="#e0e0e0"
          strokeWidth="5"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
        />
        <circle
          className="template-progress-ring__circle"
          stroke={color}
          strokeWidth="5"
          fill="transparent"
          r={radius}
          cx="60"
          cy="60"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      <div className="template-progress-text">
        {progress >= 100 ? "Download Complete" : `${progress}%`}
      </div>
    </div>
  );
}
