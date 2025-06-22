import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBModal, MDBModalBody, MDBModalHeader, MDBAlert } from "mdbreact";
import Patient from "./patient.jsx";
import { formColor } from "./../../../../../../services/utilities";
import {
  TOGGLE,
  HEADS,
  SetHEADS,
} from "./../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";
import BodySwitcher from "./bodySwitcher/index.jsx";
import Footer from "./footer.jsx";

export default function Modal() {
  const { token, activePlatform } = useSelector(({ auth }) => auth);
  const { task, showModal } = useSelector(({ validator }) => validator),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform?.branchId) {
      const branchId = activePlatform.branchId;

      const headsData = localStorage.getItem(`heads-${branchId}`);

      if (headsData) {
        dispatch(SetHEADS(JSON.parse(headsData)));
      } else {
        dispatch(HEADS({ token, branchId })).then((res) => {
          if (res?.payload) {
            localStorage.setItem(
              `heads-${branchId}`,
              JSON.stringify(res.payload?.payload)
            );
          }
        });
      }
    }
  }, [token, dispatch, activePlatform]);

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
        <Patient patient={task?.patient} />
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
