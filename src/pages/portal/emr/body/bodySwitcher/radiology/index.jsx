import Xray from "./xray";
import Ecg from "./ecg";
import Ultrasound from "./ultrasound";
import { MDBCard, MDBCardBody } from "mdbreact";

const Blank = ({ task }) => <div>{task?.form} is not working</div>;

const componentMap = {
  xray: Xray,
  ecg: Ecg,
  ultrasound: Ultrasound,
};

export default function Radiology({ task }) {
  const Component = componentMap[task?.form?.toLowerCase()] || Blank;
  return (
    <div>
      <MDBCard>
        <MDBCardBody className="m-0 p-2">
          <Component task={task} />
        </MDBCardBody>
      </MDBCard>
    </div>
  );
}
