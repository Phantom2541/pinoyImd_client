import React from "react";
import "./style.css";

export default function Note({ togglePanel, buttonRefs, activePanels }) {
  return (
    <div
      className={`checkup-data-note ${
        Object.values(activePanels).some(Boolean) && "active"
      }`}
    >
      <button
        className={`${activePanels.request && "active"}`}
        ref={buttonRefs.request}
        onClick={() => togglePanel("request")}
      >
        Request Form
      </button>
      <button
        className={`${activePanels.prescription && "active"}`}
        ref={buttonRefs.prescription}
        onClick={() => togglePanel("prescription")}
      >
        Prescription
      </button>
      <button
        className={`${activePanels.medcert && "active"}`}
        ref={buttonRefs.medcert}
        onClick={() => togglePanel("medcert")}
      >
        Medical certificate
      </button>
      <button
        className={`${activePanels.clearance && "active"}`}
        ref={buttonRefs.clearance}
        onClick={() => togglePanel("clearance")}
      >
        Medical Clearance
      </button>
    </div>
  );
}
