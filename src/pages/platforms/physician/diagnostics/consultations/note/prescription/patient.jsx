import React from "react";

export default function Patient() {
  return (
    <div className="checkup-data-prescription-card-patient-info">
      <div className="checkup-data-prescription-card-patient-info-row">
        <div className="checkup-data-prescription-card-input">
          <label>Patient name:</label>
          <input type="text" />
        </div>
        <div className="checkup-data-prescription-card-input w-25">
          <label>date:</label>
          <input type="text" />
        </div>
      </div>
      <div className="checkup-data-prescription-card-patient-info-row">
        <div className="checkup-data-prescription-card-input">
          <label>Age:</label>
          <input type="text" />
        </div>
        <div className="checkup-data-prescription-card-input">
          <label>Gender:</label>
          <input type="text" />
        </div>
        <div className="checkup-data-prescription-card-input">
          <label>Weight:</label>
          <input type="text" />
        </div>
      </div>
      <div className="checkup-data-prescription-card-patient-info-row">
        <div className="checkup-data-prescription-card-input">
          <label>diagnosis:</label>
          <input type="text" />
        </div>
      </div>
    </div>
  );
}
