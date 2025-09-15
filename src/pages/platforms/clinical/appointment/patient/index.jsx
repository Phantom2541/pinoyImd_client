import { useDispatch, useSelector } from "react-redux";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
} from "mdbreact";
import { TOGGLE_PATIENT_MODAL } from "../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { useState } from "react";
import Stepper from "../../../../../components/stepper";
import Step1 from "./steps/step-1";
import Step2 from "./steps/step-2";
import Step3 from "./steps/step-3";
const steps = [
  {
    label: "Patient",
  },
  {
    label: "Diagnostics",
  },
  {
    label: "eMR",
  },

  {
    label: "VS",
  },
  {
    label: "Schedule",
  },
];
const stepMap = {
  0: Step1,
  1: Step2,
  2: Step3,
};
export default function PatientModal() {
  const { showPatientModal } = useSelector(({ appointments }) => appointments),
    [form, setForm] = useState({ isRegister: false }),
    [activeStep, setActiveStep] = useState(0),
    dispatch = useDispatch();

  const toggle = () => dispatch(TOGGLE_PATIENT_MODAL());
  const Step = stepMap[activeStep];

  const modalSize = () => {
    if (activeStep === 0) {
      if (form.isRegister) {
        return "md";
      } else {
        return "md";
      }
    } else if (activeStep === 1) {
      return "xl";
    }
    return "xl";
  };
  return (
    <MDBModal
      isOpen={showPatientModal}
      toggle={toggle}
      backdrop
      size={modalSize()}
    >
      <MDBModalHeader
        toggle={toggle}
        className=" light-blue darken-3 white-text"
      >
        <MDBIcon icon="user-injured" className=" mr-2" />
        Patient Appointment
      </MDBModalHeader>

      <MDBModalBody>
        <div className="mt-n2">
          <Stepper steps={steps} activeStep={activeStep} />
        </div>

        <Step form={form} setForm={setForm} />
        <div
          className={`"d-flex justify-content-${
            activeStep > 0 ? "between" : "end"
          } mt-3`}
        >
          {activeStep > 0 && (
            <MDBBtn
              size="md"
              onClick={() => setActiveStep(activeStep - 1)}
              color="light"
            >
              Prev
            </MDBBtn>
          )}
          <MDBBtn
            size="md"
            className="float-right"
            color="primary"
            onClick={() => setActiveStep(activeStep + 1)}
          >
            Next
          </MDBBtn>
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
