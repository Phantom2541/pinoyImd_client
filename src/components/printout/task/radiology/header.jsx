import React from "react";
import {
  formColor,
  getAge,
  fullName as nameFormatter,
} from "../../../../services/utilities";
import { MDBRow, MDBCol, MDBAlert } from "mdbreact";
import { Categories } from "../../../../services/fakeDb";
export default function Header({ task }) {
  const { category, patient, source, referral, form, updatedAt } = task;
  const { fullName: pFull, isMale = false, dob = "", _id } = patient;
  const categoryWidth = source && referral ? "30%" : "64.2%";

  return (
    <div className="px-1">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          Name:&nbsp;
          <h5
            className="mb-0 fw-bold text-wrap"
            style={{ flex: 1, whiteSpace: "normal" }}
          >
            <u>{nameFormatter(pFull, true)}</u>
          </h5>
        </div>
        <div>
          <span>Date: {new Date(updatedAt).toDateString()}</span>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          Patient ID :&nbsp;
          <span
            className="mb-0 fw-bold text-wrap"
            style={{ flex: 1, whiteSpace: "normal" }}
          >
            {_id}
          </span>
        </div>
        <div>
          <span>Time: {new Date(updatedAt).toLocaleTimeString()}</span>
        </div>
      </div>

      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <span>
            Age:&nbsp;{getAge(dob)} | Gender: {isMale ? "Male" : "Female"}
          </span>
        </div>
        <div>
          <span>Case# : {task._id}</span>
        </div>
      </div>
      <MDBRow>
        <MDBCol style={{ alignItems: "baseline" }} className="text-left">
          <span style={{ width: categoryWidth }}>
            Category:&nbsp;
            {category === "walkin"
              ? "Walkin"
              : Categories.find(({ abbr }) => abbr === category)?.name}
          </span>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol style={{ alignItems: "baseline" }} className="text-left">
          <span style={{ width: categoryWidth }}>
            Physician: Dr. {referral?.fullName?.lname}
          </span>
        </MDBCol>
        <MDBCol className="text-right">
          <span>Source: {source?.displayname}</span>
        </MDBCol>
      </MDBRow>
      <MDBAlert
        color={formColor(form)}
        className="text-uppercase d-flex align-items-center justify-content-center text-center py-0 mb-1 mt-2"
      >
        <h5
          style={{
            color: "red",
            fontWeight: "bold",
            textAlign: "center",
            letterSpacing: "5px",
          }}
          className="mt-2"
        >
          ROENTGENOLOGICAL REPORT
        </h5>
      </MDBAlert>
    </div>
  );
}
