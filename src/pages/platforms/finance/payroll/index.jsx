import { MDBCard, MDBCardBody } from "mdbreact";
import Body from "./tables";
import Header from "./header";
import Modal from "./modal";

export default function Payrolls() {
  return (
    <>
      <MDBCard>
        <Header />
        <MDBCardBody>
          <Body />
        </MDBCardBody>
      </MDBCard>
      <Modal />
    </>
  );
}
