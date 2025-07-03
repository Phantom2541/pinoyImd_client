import React from "react";

export default function Legend() {
  return (
    <div className="template-schedule-legend">
      <span className="template-schedule-legend-title">Legend:</span>
      <span>
        <strong>7</strong> = 7am - 5pm (Clinical Chemistry)
      </span>
      <span>
        <strong>CM</strong> = 8am - 3pm Clinical Microscopy
      </span>
      <span>
        <strong>HM</strong> = 8am - 3pm Hematology
      </span>
      <span>
        <strong>SR</strong> = 8am - 3pm Serology
      </span>
    </div>
  );
}
