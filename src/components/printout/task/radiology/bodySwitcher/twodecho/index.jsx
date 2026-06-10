// import { MDBTable } from "mdbreact";
// import MMMode from "./mmMode";
// import Volumes from "./volumes";
// import Parameters from "./parameters";
// import Diastolic from "./diastolic";
import Quantitative from "./quantitative";

export default function TwoDEcho({ task }) {
  if (!task) return <div>No task data provided</div>;
  return (
    <>
      <Quantitative task={task} />
    </>
  );
}
