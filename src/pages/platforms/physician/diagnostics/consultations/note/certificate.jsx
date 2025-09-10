import React from "react";
import usePanelPosition from "./panelPosition";

export default function Certificate({ active, buttonRefs }) {
  const style = usePanelPosition(active, buttonRefs.medcert);

  return (
    <div style={style} className="checkup-data-certificate">
      Here is your Certificate
    </div>
  );
}
