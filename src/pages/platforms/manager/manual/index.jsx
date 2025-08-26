import React from "react";
import { MDBContainer, MDBCard, MDBCardBody } from "mdbreact";

export default function UserManual() {
  return (
    <MDBContainer className="my-4">
      <MDBCard>
        <MDBCardBody>
          <h1 className="mb-4">
            📌 Pinoy-iMD Registration & Setup Instructions
          </h1>

          {/* STEP 1 */}
          <h3 className="mt-3">Step 1: Company Registration</h3>
          <ul>
            <li>✅ Fill out the official Google Form</li>
            <li>✅ Message us (Technowiz/Agent) after completing</li>
            <li>
              ✅ Wait for our confirmation that your company is registered
            </li>
          </ul>

          {/* STEP 2 */}
          <h3 className="mt-4">Step 2: Initial Setup (Configuration)</h3>
          <p>
            Once registered, log in to your <b>Manager Platform</b> and
            complete:
          </p>

          <ol>
            <li className="mt-2">
              <b>Menu (Price Declarations)</b> <br />
              👉 Add, Edit or update initial prices <br />
              📍 Path: <i>System Config → Product & Services Setup → Menu</i>
            </li>
            <li className="mt-2">
              <b>Services (Reference Values)</b> <br />
              👉 Update reference values (esp. Chemistry & Serology) <br />
              📍 Path:{" "}
              <i>System Config → Product & Services Setup → Services</i>
            </li>
            <li className="mt-2">
              <b>Staff</b> <br />
              👉 Review applications & assign positions/access <br />
              📍 Path: <i>HR → Applicants</i>
            </li>
            <li className="mt-2">
              <b>Signatories</b> <br />
              👉 Encode & upload signatories (MedTech, Pathologist, etc.) <br />
              📍 Path: <i>HR → Signatories</i>
            </li>
            <li className="mt-2">
              <b>Sources</b> <br />
              👉 Register Outsource (Sendout), Insource, Utilities, or Hotlines{" "}
              <br />
              📍 Path: <i>System Config → Sources & Utilities</i>
            </li>
          </ol>

          {/* STEP 3 */}
          <h3 className="mt-4">Step 3: System Activation</h3>
          <ul>
            <li>
              ✅ After completing all (Menu, Services, Staff, Signatories,
              Sources), inform us
            </li>
            <li>
              ✅ We will activate your system for full control & live operation
            </li>
          </ul>

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
