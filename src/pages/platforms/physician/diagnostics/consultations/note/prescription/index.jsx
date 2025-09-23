import React from "react";
import usePanelPosition from "./../panelPosition";
import Header from "./header";
import Patient from "./patient";
import Body from "./body";
import Footer from "./footer";
import { MDBIcon } from "mdbreact";

export default function Prescription({ active, buttonRefs, togglePanel }) {
  const style = usePanelPosition(active, buttonRefs.prescription, {
    width: "4.25in",
    height: "5.5in",
  });

  return (
    <div style={style} className="checkup-data-prescription-container">
      <MDBIcon
        icon="times"
        className="checkup-data-note-close"
        onClick={() => togglePanel("prescription")}
      />
      <div className="checkup-data-prescription-card">
        <Header />
        <Patient />
        <Body toggle={() => togglePanel("prescription")} />
        <Footer />
      </div>
    </div>
  );
}
