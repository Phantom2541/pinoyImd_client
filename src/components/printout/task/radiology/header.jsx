import React from "react";
import {
  formColor,
  getAge,
  fullName as nameFormatter,
} from "../../../../services/utilities";
import { MDBRow, MDBCol, MDBAlert } from "mdbreact";
import { Categories } from "../../../../services/fakeDb";
export default function Header({
  patient,
  date,
  source,
  category,
  referral,
  task,
  form,
}) {
  const { fullName: pFull, isMale = false, dob = "", _id } = patient;
  const categoryWidth = source && referral ? "30%" : "64.2%";

  return (
    <div className="px-1">
      <MDBRow>
        <MDBCol md="8" style={{ alignItems: "baseline" }} className="d-flex">
          Name:&nbsp;
          <h5
            className="mb-0 fw-bold text-wrap"
            style={{ flex: 1, whiteSpace: "normal" }}
          >
            <u>{nameFormatter(pFull, true)}</u>
          </h5>
        </MDBCol>
        <MDBCol className="text-right">
          <span>Date: {new Date(date).toDateString()}</span>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol md="8" style={{ alignItems: "baseline" }} className="d-flex">
          Patient ID :&nbsp;
          <small
            className="mb-0 fw-bold text-wrap"
            style={{ flex: 1, whiteSpace: "normal" }}
          >
            {_id}
          </small>
        </MDBCol>
        <MDBCol className="text-right">
          <span>Time: {new Date(date).toLocaleTimeString()}</span>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol style={{ alignItems: "baseline" }} className="text-left">
          <span style={{ width: "64.2%" }}>
            Age:&nbsp;{getAge(dob)} | Gender: {isMale ? "Male" : "Female"}
          </span>
        </MDBCol>
        <MDBCol className="text-right">
          <span>Case# : {task._id}</span>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol style={{ alignItems: "baseline" }} className="text-left">
          {referral ? (
            <span style={{ width: categoryWidth }}>
              Referral: Dr. {referral?.fullName?.lname}
            </span>
          ) : (
            <span style={{ width: categoryWidth }}>
              Category:&nbsp;
              {category === "walkin"
                ? "Walkin"
                : Categories.find(({ abbr }) => abbr === category)?.name}
            </span>
          )}
        </MDBCol>
        <MDBCol className="text-right">
          {source && (
            <span>
              Source: {source?.displayname}, {source?.name}
            </span>
          )}
        </MDBCol>
      </MDBRow>
      <MDBAlert
        color={formColor(form)}
        className="text-uppercase text-center py-0 mb-1"
      >
        <h2
          style={{
            color: "red",
            fontWeight: "bold",
            textAlign: "center",
            letterSpacing: "10px",
          }}
        >
          ROENTGENOLOGICAL REPORT
        </h2>
      </MDBAlert>
    </div>
  );
}
