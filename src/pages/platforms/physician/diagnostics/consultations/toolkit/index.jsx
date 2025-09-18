import React from "react";
import "./style.css";

export default function Toolkit({ activePanels }) {
  return (
    <div
      className={`checkup-data-toolkit ${
        Object.values(activePanels).some(Boolean) && "active"
      }`}
    >
      <button>case</button>
      <div>
        <button className="checkup-data-toolkit-button prev">
          <span data-hover="«">Prev</span>
        </button>
        <button className="checkup-data-toolkit-button next">
          <span data-hover="»">Next</span>
        </button>
        <button className="checkup-data-toolkit-button done">
          <span data-hover="✓">Done</span>
        </button>
      </div>
    </div>
  );
}
