import React, { useState } from "react";
import { MDBBtn, MDBCol, MDBRow, MDBIcon } from "mdbreact";
import LabRequest from "./labRequest";
import CardRequest from "./cardRequest";
import "./style.css";

const steps = [
  {
    id: 1,
    label: "Request Form",
    content: <LabRequest />,
  },
  {
    id: 2,
    label: "Card",
    content: <CardRequest />,
  },
  {
    id: 3,
    label: "Schedule",
    content: (
      <div className="text-center">
        <h5>You're all set!</h5>
        <p>Review and submit your diagnostic appointment request.</p>
        <MDBBtn color="success">Submit Booking</MDBBtn>
      </div>
    ),
  },
];

const CustomStepper = () => {
  const [activeStep, setActiveStep] = useState(1);

  const nextStep = () => {
    if (activeStep < steps.length) setActiveStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 1) setActiveStep(activeStep - 1);
  };

  return (
    <div className="stepper-wrapper ">
      <div className="stepper-container mb-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className={`step ${activeStep >= step.id ? "active" : ""}`}
              onClick={() => setActiveStep(step.id)}
            >
              <div className="step-circle">
                {step.id === 3 ? (
                  <MDBIcon icon="exclamation-triangle" />
                ) : (
                  step.id
                )}
              </div>
              <div className="step-label">{step.label}</div>
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`step-line ${activeStep > step.id ? "filled" : ""}`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="step-content">
        {steps.find((s) => s.id === activeStep)?.content}
      </div>

      <div className="stepper-buttons">
        <MDBRow className="mt-3">
          <MDBCol md="12" className="text-right">
            {activeStep > 1 && (
              <MDBBtn onClick={prevStep} rounded color="white" flat>
                Back
              </MDBBtn>
            )}
            {activeStep < steps.length && (
              <MDBBtn color="primary" onClick={nextStep} rounded>
                Next
              </MDBBtn>
            )}
          </MDBCol>
        </MDBRow>
      </div>
    </div>
  );
};

export default CustomStepper;
