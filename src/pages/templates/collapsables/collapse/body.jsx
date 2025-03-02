import React from "react";
import { MDBCol, MDBRow, MDBBadge } from "mdbreact";

export default function Collapsable({ decSS, frequency }) {
  return (
    <>
      <MDBRow>
        <MDBCol md={2}>
          <h5>{frequency}</h5>
          <hr />
          <small>{decSS}</small>
        </MDBCol>
        <MDBCol md={3}>
          <div className="d-flex justify-items-center justify-content-between m-0 p-0 ">
            <h5>Access</h5>
            <MDBBadge>5</MDBBadge>
          </div>
        </MDBCol>
      </MDBRow>
    </>
  );
}
