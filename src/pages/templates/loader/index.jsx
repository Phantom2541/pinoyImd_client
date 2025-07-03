import React, { useState, useEffect } from "react";
import "./style.css";

export default function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50); // simulate download

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="template-progress-container">
      <svg className="template-progress-ring" width="120" height="120">
        {/* Grey background circle */}
        <circle
          stroke="#e0e0e0"
          strokeWidth="5"
          fill="transparent"
          r="50"
          cx="60"
          cy="60"
        />
        {/* Progress circle */}
        <circle
          className="template-progress-ring__circle"
          stroke="#3498db"
          strokeWidth="5"
          fill="transparent"
          r="50"
          cx="60"
          cy="60"
          style={{
            strokeDasharray: 2 * Math.PI * 50,
            strokeDashoffset: 2 * Math.PI * 50 * (1 - progress / 100),
          }}
        />
      </svg>
      <div className="template-progress-text">{progress}%</div>
    </div>
  );
}
