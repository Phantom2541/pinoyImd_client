import React, { useState } from "react";
import "./style.css";
import { useSelector } from "react-redux";

export default function Note({ togglePanel, buttonRefs, activePanels }) {
  const { patient } = useSelector(({ consultations }) => consultations);
  const [active, setActive] = useState(false);

  const color = patient?.isMale ? "#007bff" : "#e83e8c";
  return (
    <div
      className={`checkup-data-note ${
        Object.values(activePanels).some(Boolean) && "active"
      }`}
    >
      <div
        className="checkup-data-note-toggle"
        style={{
          backgroundColor: active ? color : "transparent",
          color: active && "white",
        }}
        onClick={() => setActive(!active)}
      >
        <span>Notes</span>
        <i
          className="fas fa-angle-up"
          style={{
            transform: `rotate(${active ? -180 : 0}deg)`,
            transition: "transform 0.5s ease",
          }}
        ></i>
      </div>
      <div className={`checkup-data-note-options ${active && "active"}`}>
        <button
          className={`${activePanels.request && "active"} ${
            patient?.isMale ? "male-btn" : "female-btn"
          }`}
          ref={buttonRefs.request}
          onClick={() => togglePanel("request")}
        >
          Request Form
        </button>
        <button
          className={`${activePanels.prescription && "active"} ${
            patient?.isMale ? "male-btn" : "female-btn"
          }`}
          ref={buttonRefs.prescription}
          onClick={() => togglePanel("prescription")}
        >
          Prescription
        </button>
        <button
          className={`${activePanels.medcert && "active"} ${
            patient?.isMale ? "male-btn" : "female-btn"
          }`}
          ref={buttonRefs.medcert}
          onClick={() => togglePanel("medcert")}
        >
          Medical certificate
        </button>
        <button
          className={`${activePanels.clearance && "active"} ${
            patient?.isMale ? "male-btn" : "female-btn"
          }`}
          ref={buttonRefs.clearance}
          onClick={() => togglePanel("clearance")}
        >
          Medical Clearance
        </button>
      </div>
    </div>
  );
}
