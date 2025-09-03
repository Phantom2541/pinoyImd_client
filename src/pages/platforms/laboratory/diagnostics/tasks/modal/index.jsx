import { useDispatch, useSelector } from "react-redux";
import { MDBModal, MDBModalBody, MDBModalHeader, MDBAlert } from "mdbreact";
import Patient from "./patient";
import { formColor } from "./../../../../../../services/utilities";
import { TOGGLE } from "./../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";
import BodySwitcher from "./bodySwitcher";
import Footer from "./footer.jsx";
export default function Modal() {
  const { task, showModal } = useSelector(({ validator }) => validator),
    dispatch = useDispatch();

  return (
    <MDBModal
      size="lg"
      isOpen={showModal}
      toggle={() => dispatch(TOGGLE("task"))}
      backdrop
    >
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE("task"))}
        className="light-blue darken-3 white-text"
      >
        <Patient patient={task?.customerId} />
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
        <BodySwitcher />
        <Footer />
      </MDBModalBody>
    </MDBModal>
  );
}
