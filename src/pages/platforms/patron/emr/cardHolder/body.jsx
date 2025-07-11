import React, { useEffect, useState } from "react";
import { MDBBtn, MDBCol, MDBRow, MDBIcon } from "mdbreact";
import LabRequest from "./labRequest";
import CardRequest from "./cardRequest";
import "./style.css";
import Schedule from "./schedule";
import Proof from "./validID";
import ValidID from "./validID";

const steps = [
  {
    id: 1,
    label: "Request Form",
    component: LabRequest,
  },
  {
    id: 2,
    label: "Card",
    component: CardRequest,
  },
  {
    id: 3,
    label: "Valid ID",
    component: ValidID,
  },

  {
    id: 4,
    label: "Schedule",
    component: Schedule,
  },
];

const CustomStepper = () => {
  const [form, setForm] = useState({
      form: "",
      branch: "",
      haveCard: null,
      card: {
        img: "",
        type: "",
        primary: true,
        proof: "",
      },
      schedule: {
        branch: "",
        date: "",
      },
    }),
    [activeStep, setActiveStep] = useState(1),
    [valid, setValid] = useState({ 1: true, 2: true, 3: true }); //form,card,schedule

  const prevStep = () => {
    const _activeStep = activeStep > 1 ? activeStep - 1 : 1;
    setActiveStep(_activeStep);
  };

  const isLastStep = activeStep === steps.length;

  const CurrentComponent = steps.find((s) => s.id === activeStep)?.component;

  const handleNext = (e) => {
    e.preventDefault();

    const isStep1 = activeStep === 1;
    const isStep2 = activeStep === 2;
    const isStep3 = activeStep === 3;
    const isStep4 = activeStep === 4;

    if (isStep1) {
      const isValid = !!form.form;
      setValid((v) => ({ ...v, 1: isValid }));
      if (isValid) setActiveStep(2);
    }

    if (isStep2) {
      if (!form.haveCard) {
        return setActiveStep(4);
      }
      const isValid = !!form.card.img;
      setValid((v) => ({ ...v, 2: isValid }));
      if (isValid) setActiveStep(3);
    }

    if (isStep3) {
      const isValid = !!form.card.proof;
      setValid((v) => ({ ...v, 3: isValid }));
      if (isValid) setActiveStep(4);
    }

    if (isStep4) {
      const isValid = form.schedule.branch && form.schedule.date;
      setValid((v) => ({ ...v, 3: !!isValid }));
      // You can trigger submit here if needed
    }
  };
  const fakeDB = localStorage.getItem("patronCompany");
  const { hmo = [], branches = [] } = fakeDB ? JSON.parse(fakeDB) : {};

  const { card } = form;
  return (
    <form onSubmit={handleNext}>
      <div className="stepper-wrapper ">
        <div className="stepper-container mb-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div
                className={`step ${activeStep >= step.id ? "active" : ""}`}
                onClick={() => setActiveStep(step.id)}
              >
                <div className="step-circle">
                  {step.id === 4 ? (
                    <MDBIcon far icon="calendar-check" />
                  ) : (
                    step.id
                  )}
                </div>
                <div className="step-label">{step.label}</div>
              </div>
              {index !== steps.length - 1 && (
                <div
                  className={`step-line ${
                    activeStep > step.id ? "filled" : ""
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="step-content">
          {CurrentComponent && (
            <CurrentComponent
              branches={branches}
              hmo={hmo}
              isValid={valid[activeStep]}
              setForm={setForm}
              form={form}
              setIsValid={(isValid) =>
                setValid((v) => ({ ...v, [activeStep]: isValid }))
              }
              setActiveStep={setActiveStep}
            />
          )}
        </div>

        <div className="stepper-buttons">
          <MDBRow className="mt-3">
            <MDBCol md="12" className="text-right">
              {activeStep > 1 && (
                <MDBBtn onClick={prevStep} rounded color="white" flat>
                  Back
                </MDBBtn>
              )}
              <MDBBtn color="primary" rounded type="submit">
                {isLastStep ? "Submit" : "Next"}
              </MDBBtn>
            </MDBCol>
          </MDBRow>
        </div>
      </div>
    </form>
  );
};

export default CustomStepper;
