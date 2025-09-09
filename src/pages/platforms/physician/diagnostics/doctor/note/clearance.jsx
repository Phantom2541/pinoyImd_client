import React from "react";
import usePanelPosition from "./panelPosition";

export default function Clearance({ active, buttonRefs, zIndex }) {
  const style = usePanelPosition(active, buttonRefs.clearance, zIndex);

  return (
    <div style={style} className="checkup-data-clearance">
      Here is your Clearance
    </div>
  );
}
