import { useDispatch, useSelector } from "react-redux";
import { MDBModal, MDBModalBody, MDBModalHeader, MDBAlert } from "mdbreact";
import Patient from "../modal/patient";
import { TOGGLE_RAD_READER as TOGGLE } from "./../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";
import ImgMagnifier from "../../../../../../components/images/imageMagnifier/imgMagnifier.jsx";
import { formColor } from "../../../../../../services/utilities/index.js";

export default function RadReader() {
  const { task, showRadReader: showModal } = useSelector(
      ({ validator }) => validator
    ),
    dispatch = useDispatch();

  const imgSrc = `https://drive.google.com/thumbnail?id=${task.fileId}`;

  return (
    <MDBModal
      size="lg"
      isOpen={showModal}
      toggle={() => dispatch(TOGGLE())}
      backdrop
    >
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE())}
        className="light-blue darken-3 white-text"
      >
        <Patient />
      </MDBModalHeader>
      <MDBModalBody className="mb-0 text-center">
        <MDBAlert
          color={formColor(task?.form)}
          className="text-uppercase fw-bold"
        >
          <h5 style={{ letterSpacing: "30px" }} className="mb-0">
            {task?.form}
          </h5>
        </MDBAlert>
        <ImgMagnifier src={imgSrc} />
      </MDBModalBody>
    </MDBModal>
  );
}
