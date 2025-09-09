import React from "react";
import usePanelPosition from "./../panelPosition";
import LOGO from "./../../../../../../../assets/iMD.png";

export default function Prescription({ active, buttonRefs, zIndex }) {
  const style = usePanelPosition(active, buttonRefs.prescription, zIndex, {
    width: "auto",
    height: "auto",
  });

  return (
    <div style={style} className="checkup-data-prescription-container">
      <div className="checkup-data-prescription-card">
        <div className="checkup-data-prescription-card-header">
          <img
            alt="logo"
            src={LOGO}
            className="checkup-data-prescription-card-logo"
          />
          <div className="checkup-data-prescription-card-info">
            <div className="checkup-data-prescrption-card-fullname">
              <span>Dr. Carl Magtalas</span>
              <small>MSIT,RN,RMP,FCPS</small>
            </div>
            <div className="checkup-data-prescription-card-contact">
              <span>+63 927 342 2159</span>
              <span>sample@gmail.com</span>
              <span>www.PinoyiMD.com</span>
            </div>
          </div>
        </div>
        <div className="checkup-data-prescription-card-patient-info">
          <div className="checkup-data-prescription-card-patient-info-row">
            <div className="checkup-data-prescription-card-input">
              <label>Patient name:</label>
              <input type="text" />
            </div>
            <div className="checkup-data-prescription-card-input w-25">
              <label>date:</label>
              <input type="text" />
            </div>
          </div>
          <div className="checkup-data-prescription-card-patient-info-row">
            <div className="checkup-data-prescription-card-input">
              <label>Age:</label>
              <input type="text" />
            </div>
            <div className="checkup-data-prescription-card-input">
              <label>Gender:</label>
              <input type="text" />
            </div>
            <div className="checkup-data-prescription-card-input">
              <label>Weight:</label>
              <input type="text" />
            </div>
          </div>
          <div className="checkup-data-prescription-card-patient-info-row">
            <div className="checkup-data-prescription-card-input">
              <label>diagnosis:</label>
              <input type="text" />
            </div>
          </div>
        </div>
        <div className="checkup-data-prescription-card-body"></div>
        <div className="checkup-data-prescription-card-footer"></div>
      </div>
    </div>
  );
}
