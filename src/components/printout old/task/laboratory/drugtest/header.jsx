import React from "react";
// import { getAge, fullName as nameFormatter } from "../../services/utilities";
import { MDBRow, MDBCol } from "mdbreact";
// import { Categories } from "../../..services/fakeDb";
export default function Header({ patient, date, category, task }) {
  const { fullName: pFull, isMale = false, dob = "" } = patient;

  return (
    <div className="px-1">
      <MDBRow>
        <MDBCol md="8" style={{ alignItems: "baseline" }} className="d-flex">
          <img src="" alt="" />
        </MDBCol>
        <MDBCol className="text-center">
          <div>DEPARTMENT OF HEALTH</div>
          <div>SMART CARE POLY CLINIC & DIAGNOSTIC CENTER</div>
          <div>Gulod st., brgy San Pedro, Gen Tinio, Nueva Ecjia</div>
          <div>Phone number: 0932-459-0332</div>
          <div>DRUG TEST REPORT</div>
        </MDBCol>
      </MDBRow>
    </div>
  );
}
