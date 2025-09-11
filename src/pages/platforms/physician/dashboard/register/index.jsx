import {
  MDBBtn,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBRow,
} from "mdbreact";
import Information from "./information";
import Schedule from "./schedule";

export default function Register({ show, toggle = () => {} }) {
  return (
    <MDBModal
      size="fluid"
      position="center"
      isOpen={show}
      toggle={toggle}
      backdrop
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="clinic-medical" /> Register Clinic
      </MDBModalHeader>
      <MDBModalBody className="mb-0 ">
        <MDBRow>
          <Information />
          <Schedule />
        </MDBRow>
      </MDBModalBody>
    </MDBModal>
  );
}
