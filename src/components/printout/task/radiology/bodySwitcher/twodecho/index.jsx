import { MDBTable } from "mdbreact";
import MMMode from "./mmMode";
import Volumes from "./volumes";
import Parameters from "./parameters";
import Diastolic from "./diastolic";

export default function TwoDEcho({ fontSize = "16px", task }) {
  if (!task) return <div>No task data provided</div>;
  console.log("task in 2decho", task);
  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial",
        fontSize,
        minHeight: "700px",
        display: "flex",
        flexDirection: "column",
        // justifyContent: "space-between",
      }}
    >
      <MDBTable small>
        <thead>
          <tr>
            <th>Parameter</th>
            <th className="text-center">Result</th>
            <th className="text-center">Reference</th>
          </tr>
        </thead>
        <tbody>
          <MMMode task={task} />
          <Volumes task={task} />
          <Parameters task={task} />
          <Diastolic task={task} />
        </tbody>
      </MDBTable>
    </div>
  );
}
