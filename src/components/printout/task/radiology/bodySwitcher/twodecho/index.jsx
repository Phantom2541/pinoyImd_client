import { MDBTable } from "mdbreact";
import MMMode from "./mmMode";
import Volumes from "./volumes";
import Parameters from "./parameters";
import Diastolic from "./diastolic";

export default function TwoDEcho({ task }) {
  if (!task) return <div>No task data provided</div>;
  return (
    <MDBTable small bordered>
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
  );
}
