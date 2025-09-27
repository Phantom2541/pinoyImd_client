import React, { useState } from "react";
import "../style.css";

export default function PMHx({ pastMedicalHistory }) {
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (category, index) => {
    const key = `${category}-${index}`;
    setExpanded(expanded === key ? null : key);
  };

  if (!pastMedicalHistory || pastMedicalHistory.length === 0) {
    return (
      <div className="checkup-data-pmh-container d-flex justify-content-center">
        <div className="d-flex justify-content-center mb-3">
          <h3 className="m-auto">No past surgical procedures recorded.</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="checkup-data-mh-container">
      <h2 className="pmhx-title">Past Medical History</h2>
      <div className="pmhx-grid">
        {Object.entries(pastMedicalHistory).map(([category, items]) => (
          <div key={category} className="pmhx-category">
            <h3 className="pmhx-category-title">{category}</h3>
            {items.map((item, index) => {
              const key = `${category}-${index}`;
              return (
                <div
                  key={key}
                  className={`pmhx-card ${expanded === key ? "expanded" : ""}`}
                  onClick={() => toggleExpand(category, index)}
                >
                  <div className="pmhx-card-header">
                    <span className="pmhx-card-name">{item.name}</span>
                    <span
                      className={`pmhx-status ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  {expanded === key && (
                    <div className="pmhx-card-body">
                      <p>
                        <strong>Year:</strong> {item.year}
                      </p>
                      <p>
                        <strong>Remarks:</strong> {item.status}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
