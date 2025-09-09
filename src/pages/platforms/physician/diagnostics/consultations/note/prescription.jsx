import React from "react";
import usePanelPosition from "./panelPosition";

export default function Prescription({ active, buttonRefs, zIndex }) {
  const style = usePanelPosition(active, buttonRefs.prescription, zIndex);

  return (
    <div style={style} className="checkup-data-prescription">
      Here is your Prescription
    </div>
  );
}
