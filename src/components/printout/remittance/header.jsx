import React from "react";
import { MDBRow, MDBCol } from "mdbreact";
export default function Header({ vendor, month, year }) {
  return (
    <div className="px-1">
      <MDBRow>
        <MDBCol md="8" style={{ alignItems: "baseline" }} className="d-flex">
          Source:&nbsp;
          <h5
            style={{ width: "60%", minWidth: "60%" }}
            className="mb-0 fw-bold"
          >
            <u>{vendor?.displayname}</u>
          </h5>
        </MDBCol>
        <MDBCol className="text-right">
          <span>
            Date: {month},&nbsp;
            {year}
          </span>
        </MDBCol>
      </MDBRow>
    </div>
  );
}
