import React from "react";
import { MDBCol, MDBRow, MDBBadge } from "mdbreact";

export default function Collapsable({ breakdown = {} }) {
  const { deduction = {}, earn = {} } = breakdown;

  return (
    <>
      <MDBRow>
        <MDBCol md={6}>
          <h5>Deductions</h5>
          {Object.entries(deduction || {}).map(([key, value]) => (
            <div key={key} className="d-flex justify-content-between">
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
              <MDBBadge color="danger">{value}</MDBBadge>
            </div>
          ))}
        </MDBCol>

        <MDBCol md={6}>
          <h5>Earnings</h5>
          {Object.entries(earn || {}).map(([key, value]) => (
            <div key={key} className="d-flex justify-content-between">
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
              <MDBBadge color="success">{value}</MDBBadge>
            </div>
          ))}
        </MDBCol>
      </MDBRow>
    </>
  );
}
