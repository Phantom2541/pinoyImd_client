import { MDBCardBody } from "mdbreact";
import Record from "./record";

export default function TaskBody({ task }) {
  return (
    <MDBCardBody className=" w-100 m-0 p-0">
      <Record menu={task} />
    </MDBCardBody>
  );
}
