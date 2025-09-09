import React from "react";
import usePanelPosition from "./panelPosition";

export default function Form({ active, buttonRefs, zIndex }) {
  const style = usePanelPosition(active, buttonRefs.request, zIndex);

  return (
    <div style={style} className="checkup-data-form">
      <div>Form</div>
    </div>
  );
}
