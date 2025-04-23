import React from "react";
import {
  getAge,
  fullName as nameFormatter,
} from "../../../../services/utilities";
import { MDBRow, MDBCol, MDBAlert } from "mdbreact";
import { Categories } from "../../../../services/fakeDb";
import { formColor } from "../../../../services/utilities";

export default function Header({ task }) {
  const { category, patient, source, referral, form, updatedAt } = task;
  const { fullName: pFull, isMale = false, dob = "", _id } = patient;
  const categoryWidth = source && referral ? "30%" : "64.2%";

  return (
    <div className="px-1">
      <MDBRow>
        <MDBCol md="8" style={{ alignItems: "baseline" }} className="d-flex">
          Name:&nbsp;
          <h5
            style={{ width: "60%", minWidth: "60%" }}
            className="mb-0 fw-bold"
          >
            <u>{nameFormatter(pFull, true)}</u>
          </h5>
        </MDBCol>
        <MDBCol className="text-right">
          <span>Date: {new Date(updatedAt).toDateString()}</span>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol md="8" style={{ alignItems: "baseline" }} className="d-flex">
          Patient CODE :&nbsp;
          <small
            className="mb-0 fw-bold text-wrap"
            style={{ flex: 1, whiteSpace: "normal" }}
          >
            {_id}
          </small>
        </MDBCol>
        <MDBCol className="text-right">
          <span>Time: {new Date(updatedAt).toLocaleTimeString()}</span>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol style={{ alignItems: "baseline" }} className="text-left">
          <span style={{ width: "64.2%" }}>
            Age:&nbsp;{getAge(dob)} | Gender: {isMale ? "Male" : "Female"}
          </span>
        </MDBCol>
        <MDBCol className="text-right">
          <span>Transaction # : {task._id}</span>
        </MDBCol>
      </MDBRow>
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
        className="text-uppercase text-center py-0 mb-1 mt-3"
      >
        <h5 style={{ letterSpacing: "30px" }} className="mb-0 fw-bold">
          {form}
        </h5>
      </MDBAlert>
    </div>
  );
}
