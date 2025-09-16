import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdbreact";
import { TOGGLE_RESULT_MODAL } from "../../../../../services/redux/slices/diagnostics/clinic/appointments";
import {
  fullName,
  getAge,
  getGenderIcon,
} from "../../../../../services/utilities";
import Records from "./records";
import Images from "./images";

export default function ResultsModal() {
  const { showResultModal: show, selected } = useSelector(
      ({ appointments }) => appointments
    ),
    dispatch = useDispatch();

  const toggle = () => dispatch(TOGGLE_RESULT_MODAL());

  const { department = "", patient = {} } = selected || {};

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size={"fluid"}>
      <MDBModalHeader
        toggle={toggle}
        className=" light-blue darken-3 white-text"
      >
        <div className="my-n3">
          <MDBIcon fab icon="wpforms" className="mr-2" />
          {department === "lab" ? "Laboratory" : "Radiology"} Result Form
          <h6 style={{ marginLeft: "-5px" }}>
            {getGenderIcon(patient?.isMale)} {fullName(patient?.fullName)} |{" "}
            {getAge(patient?.dob)}
          </h6>
        </div>
      </MDBModalHeader>

      <MDBModalBody>
        <MDBRow>
          <MDBCol>
            <Records />
          </MDBCol>
          <MDBCol>
            <Images />
          </MDBCol>
        </MDBRow>
        <div className="text-right mt-3">
          <MDBBtn size="md" color="info">
            Submit
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
