// Doctor.jsx
import React, { useState, useRef } from "react";
import Body from "./body";
import Patient from "./patient";
import Note from "./note";
import Prescription from "./note/prescription";
import Certificate from "./note/certificate";
import Clearance from "./note/clearance";
import "./style.css";
import RequestForm from "./note/forms";

export default function Consultations() {
  const [activePanels, setActivePanels] = useState({
    request: false,
    prescription: false,
    medcert: false,
    clearance: false,
  });
  const [lastActive, setLastActive] = useState(""); // track last clicked panel

  const buttonRefs = {
    request: useRef(),
    prescription: useRef(),
    medcert: useRef(),
    clearance: useRef(),
  };

  const togglePanel = (type) => {
    setActivePanels((prev) => {
      const newState = {
        ...prev,
        [type]: !prev[type],
      };
      if (!prev[type]) setLastActive(type); // only update if panel is now active
      return newState;
    });
  };

  const getZIndex = (type) => (lastActive === type ? 200 : 120);

  return (
    <div className="checkup-data-container">
      <Body />
      <Patient />
      <Note
        togglePanel={togglePanel}
        buttonRefs={buttonRefs}
        activePanels={activePanels}
      />
      <div
        className={`checkup-data-note-mask ${
          Object.values(activePanels).some(Boolean) && "active"
        }`}
      />

      <Prescription
        active={activePanels.prescription}
        buttonRefs={buttonRefs}
        zIndex={getZIndex("prescription")}
      />
      <RequestForm
        active={activePanels.request}
        buttonRefs={buttonRefs}
        zIndex={getZIndex("request")}
      />
      <Certificate
        active={activePanels.medcert}
        buttonRefs={buttonRefs}
        zIndex={getZIndex("medcert")}
      />
      <Clearance
        active={activePanels.clearance}
        buttonRefs={buttonRefs}
        zIndex={getZIndex("clearance")}
      />
    </div>
  );
}
