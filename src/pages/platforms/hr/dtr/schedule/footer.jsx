import React from "react";

import SIGNATURE from "./../../../../../assets/templateSampleSignature.png";

export default function Footer() {
  return (
    <div className="template-schedule-signatures">
      {[
        {
          name: "Debralene Gay R. Pajarrillaga, RMT",
          title: "Chief Medical Technologist",
        },
        {
          name: "Tomas B. Pajarrillaga Jr., RMT, RN, MSIT",
          title: "Administrator",
        },
        {
          name: "Nick R. Fernandez, MD, FPSP",
          title: "Pathologist",
        },
      ].map((person, idx) => (
        <div key={idx} className="template-schedule-signature-container">
          <span className="template-schedule-signature-checked">
            Checked By:
          </span>

          <div className="template-schedule-signature-info">
            <img src={SIGNATURE} alt="signature" />
            <span> {person.name}</span>
            <em>{person.title}</em>
          </div>
        </div>
      ))}
    </div>
  );
}
