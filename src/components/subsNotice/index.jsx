import React, { useState } from "react";
import "./style.css";
import { MDBIcon } from "mdbreact";

export default function SubsNotice({ daysLeft = 9, totalDays = 30 }) {
  const [showSubsNotice, setShowSubsNotice] = useState(true);

  const progressPercent = Math.max(
    0,
    Math.min(100, (daysLeft / totalDays) * 100)
  );

  return (
    <div className={`subsNotice-container ${showSubsNotice ? "" : "hide"}`}>
      <div className="subsNotice-card">
        <span className="subsNotice-header">SUBSCRIPTION STATUS</span>

        <div className="subsNotice-days-left">
          <span className="subsNotice-days-number">{daysLeft}</span>
          <div>
            <span className="subsNotice-days">
              DAY{daysLeft > 1 ? "S" : ""}
            </span>
            <span className="subsNotice-left">LEFT</span>
          </div>
        </div>

        <div className="subsNotice-progress-bar">
          <div
            className="subsNotice-progress-fill"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <p className="subsNotice-note">Your subscription will expire soon.</p>

        <button className="subsNotice-renew-button">RENEW NOW</button>

        <button
          className="subsNotice-close"
          onClick={() => setShowSubsNotice(false)}
        >
          <MDBIcon icon="times" />
        </button>
      </div>
    </div>
  );
}
