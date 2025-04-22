import React from "react";
import {
  getAge,
  fullName as nameFormatter,
} from "../../../../services/utilities";
import { MDBRow, MDBCol } from "mdbreact";
import { Categories } from "../../../../services/fakeDb";
export default function Header({
  patient,
  date,
  source,
  category,
  referral,
  task,
}) {
  console.log("patient", patient);

  const { fullName: pFull, isMale = false, dob = "" } = patient;
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
          <span>
            Date: {new Date(date).toDateString()},&nbsp;
            {new Date(date).toLocaleTimeString()}
          </span>
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol style={{ alignItems: "baseline" }} className="text-left">
          <span style={{ width: "64.2%" }}>
            Age:&nbsp;{getAge(dob)} | Gender: {isMale ? "Male" : "Female"}
          </span>
        </MDBCol>
        <MDBCol className="text-right">
          <span>Transaction# : {task._id}</span>
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
    </div>
  );
}
