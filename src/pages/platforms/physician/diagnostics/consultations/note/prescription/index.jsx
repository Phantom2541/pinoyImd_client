import React from "react";
import usePanelPosition from "./../panelPosition";
import Header from "./header";
import Patient from "./patient";
import Body from "./body";
import Footer from "./footer";

export default function Prescription({ active, buttonRefs, zIndex }) {
  const style = usePanelPosition(active, buttonRefs.prescription, zIndex, {
    width: "auto",
    height: "auto",
  });

  return (
    <div style={style} className="checkup-data-prescription-container">
      <div className="checkup-data-prescription-card">
        <Header />
        <Patient />
        <Body />
        <Footer />
      </div>
    </div>
  );
}
