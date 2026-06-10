import React from "react";
import { MDBContainer, MDBCard, MDBCardBody } from "mdbreact";
import Step2 from "./STEP 2.jsx";
import Step1 from "./STEP 1.jsx";
import Step3 from "./STEP 3.jsx";

export default function UserManual() {
  return (
    <MDBContainer className="my-4">
      <MDBCard>
        <MDBCardBody>
          <h1 className="mb-4">
            📌 Subscriber Registration & Setup Instructions
          </h1>
          <Step1 />
          <Step2 />
          <Step3 />

          {/* REMINDERS */}
          <h3 className="mt-4 text-danger">⚠️ Reminders</h3>
          <ul>
            <li>Don’t instruct staff to sign up until company is active</li>
            <li>
              Double-check prices, reference values & signatories before
              activation
            </li>
          </ul>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
