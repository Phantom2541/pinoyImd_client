import React from "react";
import usePanelPosition from "./panelPosition";

export default function Clearance({ active, buttonRefs }) {
  const style = usePanelPosition(active, buttonRefs.clearance);

  return (
    <div style={style} className="checkup-data-clearance">
      Here is your Clearance
    </div>
  );
}
