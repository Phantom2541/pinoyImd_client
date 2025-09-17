import React from "react";
import usePanelPosition from "../panelPosition";
import { MDBIcon } from "mdbreact";
import "./../style.css";
import LOGO from "./../../../../../../../assets/aplhamed.png";
import CADUCEUS from "./../../../../../../../assets/caduceus.png";
import SIGNATURE from "./../../../../../../../assets/templateSampleSignature.png";

const certificateData = {
  patientName: "Jhon Kevin Magtalas",
  gender: "Male",
  age: 21,
  address: "Magsaysay Bayombong Nueva Vizcaya",
  diagnosis: "Pneumonia",
  startDate: "August 1, 2025",
  endDate: "August 21, 2025",
  doctorName: "Dr. Emily Clark",
};

export default function Clearance({
  active,
  buttonRefs,

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
        {/* Header */}
        <div className="checkup-data-clearance-card-header">
          <img src={LOGO} alt="" />
          <span>Medi Care</span>
          <span>123 Main St., Quezon City</span>
          <span>Contact: (02) 1234-5678</span>
        </div>

        {/* Title */}
        <h1 className="checkup-data-clearance-card-title">
          Medical Certificate
        </h1>

        {/* Body */}
        <div className="checkup-data-clearance-card-body">
          <div className="checkup-data-clearance-card-body-date">
            <span>Date:</span>
            <span>{certificateData.endDate}</span>
          </div>
          <img alt="caducues" src={CADUCEUS} />
          <label>TO WHOMSOEVER IT MAY CONCERN</label>

          <div className="checkup-data-clearance-card-body-text">
            <span>
              This is to certify that Mr/Mrs.&nbsp;
              <span className="checkup-data-clearance-card-body-data width-50">
                {certificateData.patientName}
              </span>
              &nbsp; Male/Female&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {certificateData.gender}
              </span>
              &nbsp;Age&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {certificateData.age}
              </span>
              &nbsp;years, residing at&nbsp;
              <span className="checkup-data-clearance-card-body-data">
                {certificateData.address}
              </span>
              , was examined at this clinic and is found to be
              <span className="checkup-data-clearance-card-body-data">
                medically fit
              </span>{" "}
              to engage in
              <span className="checkup-data-clearance-card-body-data">
                work/school/sports/travel
              </span>
              .
            </span>
          </div>

          {/* Doctor */}
          <div className="checkup-data-clearance-card-body-doctor">
            <span>{certificateData.doctorName}</span>
            <span>Physician/Examiner</span>
            <img alt="signature" src={SIGNATURE} />
          </div>
        </div>
      </div>
    </div>
  );
}
