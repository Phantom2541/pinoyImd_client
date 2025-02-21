import React from "react";
import CellCount from "./cellcount";
import DiffCount from "./diffcount";
import Rci from "./rci";

export default function Hematology({ fontSize, task }) {
  const style = { fontSize: `${fontSize - 0.06}px` },
    { patient, cc, dc, rci, apc, troupe, ct, bt } = task;

  return (
    <div className="d-flex">
      <CellCount
        cc={cc}
        isMale={patient.isMale ? "Male" : "Female"}
        style={style}
        apc={apc}
      />
      <DiffCount dc={dc} style={style} />
      <Rci rci={rci} style={style} troupe={troupe} ct={ct} bt={bt} />
    </div>
  );
}
