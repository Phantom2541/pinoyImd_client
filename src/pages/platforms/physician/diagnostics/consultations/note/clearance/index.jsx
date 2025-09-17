import React from "react";
import usePanelPosition from "../panelPosition";
import { MDBIcon } from "mdbreact";
import "./../style.css";
import LOGO from "./../../../../../../../assets/iMD.png";
import CADUCEUS from "./../../../../../../../assets/caduceus.png";
import SIGNATURE from "./../../../../../../../assets/templateSampleSignature.png";

export default function Clearance({
  active,
  buttonRefs,
  patient,
  doctor,
  purpose,
  date,
  togglePanel,
}) {
  const style = usePanelPosition(active, buttonRefs.clearance, {
    width: 700,
    height: 600,
  });

  return (
    <div
      style={{
        ...style,
      }}
      className="checkup-data-clearance"
    >
      <MDBIcon
        icon="times"
        className="checkup-data-note-close"
        onClick={() => togglePanel("clearance")}
      />
      <div className="checkup-data-clearance-card">
        <div className="checkup-data-clearance-card-header">
          <img src={LOGO} alt="" />
          <span>Medi Care</span>
          <span>123 Main St., Quezon City</span>
          <span>Contact: (02) 1234-5678</span>
        </div>
        <h1 className="checkup-data-clearance-card-title">
          Medical Certificate
        </h1>
        <div className="checkup-data-clearance-card-body">
          <div className="checkup-data-clearance-card-body-date">
            <span>Date:</span>
            <span>August 21, 2025</span>
          </div>
          <img alt="caducues" src={CADUCEUS} />
          <label>to whomsoever it may concern</label>
          <div className="checkup-data-clearance-card-body-text">
            <span>
              This is to certify that Mr/Mrs.&nbsp;
              <span className="checkup-data-clearance-card-body-data width-50">
                Jhon Kevin Magtalas
              </span>
              &nbsp; Male/Female&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                Male
              </span>
              &nbsp;Age&nbsp;
              <span className="checkup-data-clearance-card-body-data">21</span>
              &nbsp;years,residing at&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                Magsaysay Bayombong Nueva Vizcaya
              </span>
              &nbsp;was under my treatment since&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                August 1, 2025
              </span>
              &nbsp;Suffering from &nbsp;
              <span className="checkup-data-clearance-card-body-data">
                Pneumonia
              </span>
              &nbsp;He/She is/was adviced treatment or rest for this
              period&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                August 21, 2025
              </span>
            </span>
          </div>
          <div className="checkup-data-clearance-card-body-doctor">
            <span>Dr, Emily Clard adasda</span>
            <span>Physician/Examiner</span>
            <img alt="signature" src={SIGNATURE} />
          </div>
        </div>
      </div>
    </div>
  );
}
