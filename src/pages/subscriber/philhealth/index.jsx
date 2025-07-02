import React from "react";
import "./style.css";
import PHILHEALTH from "./../../../assets/subscriber/PhilHealth.png";

export default function Philhealth() {
  return (
    <div className="subscriber-philhealth-section">
      <h1 className="subscriber-philhealth-title">PhilHealth Accreditation</h1>
      <div className="subscriber-philhealth-container">
        <img alt="PhilHealth" src={PHILHEALTH} />
        <span>Accreditation ID: 684654625734</span>
      </div>
    </div>
  );
}
