import React from "react";
import usePanelPosition from "./../panelPosition";
// import Header from "./header";
import Patient from "./patient";
import Body from "./body";
import Footer from "./footer";
import { MDBIcon } from "mdbreact";
import History from "./history";

export default function Prescription({ active, buttonRefs, togglePanel }) {
  const style = usePanelPosition(active, buttonRefs.prescription, {
    width: "8.5in",
    height: "5.5in",
  });

  return (
    <div style={style} className="checkup-data-prescription-container">
      <MDBIcon
        icon="times"
        className="checkup-data-note-close"
        onClick={() => togglePanel("prescription")}
      />
      <div className="d-flex align-items-center h-full h-100">
        <div
          className="checkup-data-prescription-card"
          style={{ borderRight: "1px solid #ccc" }}
        >
          <History />
        </div>
        <div className="checkup-data-prescription-card">
          {/* <Header /> */}
          <Patient />
          <Body togglePanel={togglePanel} />
          <Footer />
        </div>
      </div>
    </div>
  );
}
