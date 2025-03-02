import React from "react";
import { getAge, fullName as nameFormatter } from "../../../services/utilities";
import { MDBRow, MDBCol } from "mdbreact";
// import { Categories } from "../../services/fakeDb";
export default function Header({ patient, category, ssx }) {
  const { fullName: pFull, isMale = false, dob = "" } = patient;

  return (
    <div className="px-1">
      <MDBRow>
        <MDBCol md="12" style={{ alignItems: "baseline" }} className="d-flex">
          Name:&nbsp;
          <h5 className="mb-0 fw-bold">
            <u>{nameFormatter(pFull, true)}</u>
          </h5>
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol style={{ alignItems: "baseline" }} md="" className="text-left">
          <span style={{ width: "30%" }}>
            Age:&nbsp;{getAge(dob)} | Gender: {isMale ? "Male" : "Female"}
          </span>
        </MDBCol>
        <MDBCol style={{ alignItems: "baseline" }} className="text-right">
          <span>Category:&nbsp;{category} </span>
        </MDBCol>
      </MDBRow>
      <h5>
        Sign and Symptoms: <span>{ssx}</span>
      </h5>
    </div>
  );
}
