import { useDispatch, useSelector } from "react-redux";
import { MDBModal, MDBModalBody, MDBModalHeader, MDBAlert } from "mdbreact";
import Patient from "./patient";
import { formColor } from "./../../../../../../services/utilities";
import { TOGGLE } from "./../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";
import BodySwitcher from "./bodySwitcher";
import Footer from "./footer.jsx";
import { useState } from "react";
import HealthyClientChoices from "./hcChoices.jsx";
export default function Modal() {
  const { task, showModal } = useSelector(({ validator }) => validator),
    dispatch = useDispatch();

  const [showHC, setShowHC] = useState(false);

  return (
    <>
      <MDBModal
        size="xl"
        isOpen={showModal}
        toggle={() => dispatch(TOGGLE("task"))}
        backdrop
      >
        <MDBModalHeader
          toggle={() => dispatch(TOGGLE("task"))}
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
          <BodySwitcher />
          <Footer setShowHC={setShowHC} />
        </MDBModalBody>
      </MDBModal>
      <HealthyClientChoices show={showHC} toggle={() => setShowHC(false)} />
    </>
  );
}
