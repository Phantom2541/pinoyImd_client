import CellCount from "./cellcount";
import DiffCount from "./diffcount";
import Rci from "./rci";

export default function Hematology({ fontSize, task }) {
  // const style = { fontSize: `${fontSize - 0.06}px` },
  const style = { fontSize: `1.1rem`, verticalAlign: "middle" },
    { patient, cc, dc, rci, apc, troupe, ct, bt } = task;
  console.log("patient", patient);
  return (
    <div>
      {/* className="d-flex" */}
      <CellCount
        cc={cc}
        isMale={patient.isMale ? "Male" : "Female"}
        dob={patient.dob}
        style={style}
        apc={apc}
      />
      <DiffCount dc={dc} style={style} dob={patient.dob} />
      <Rci
        rci={rci}
        style={style}
        troupe={troupe}
        ct={ct}
        bt={bt}
        dob={patient.dob}
      />
    </div>
  );
}
