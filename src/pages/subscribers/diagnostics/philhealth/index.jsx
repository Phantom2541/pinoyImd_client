import React from "react";
import "./style.css";

const isAccredited = (phi = {}) => {
  if (typeof phi?.accredited === "boolean") return phi.accredited;

  const start = phi?.validity?.start ? new Date(phi.validity.start) : null;
  const end = phi?.validity?.end ? new Date(phi.validity.end) : null;
  const now = new Date();

  return Boolean(start && end && start <= now && end >= now);
};

export default function Philhealth({ phi = {} }) {
  const accredited = isAccredited(phi);

  return (
    <div className="subscriber-philhealth-section">
      {accredited ? (
        <div className="subscriber-philhealth-container">
          <img alt="PhilHealth" src="/assets/logo/philhealth.png" />
          <span>Accredited</span>
        </div>
      ) : (
        <div className="subscriber-philhealth-coming-soon">
          <h3>PhilHealth Accreditation Coming Soon</h3>
          <p>
            This healthcare provider is preparing to offer PhilHealth coverage
            for patients.
          </p>
        </div>
      )}
    </div>
  );
}
