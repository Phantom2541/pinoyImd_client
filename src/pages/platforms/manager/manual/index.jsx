import React from "react";
import { MDBContainer, MDBCard, MDBCardBody } from "mdbreact";

export default function UserManual() {
  return (
    <MDBContainer>
      <MDBCard>
        <MDBCardBody>
          <h1>User Manual</h1>

          <h4 className="mt-3">Create Main Branch</h4>

          <h4 className="mt-3">Approve or Invite an employee</h4>

          <h4 className="mt-3">Create Menus</h4>

          <h4 className="mt-3">Create Price list</h4>

          <h4 className="mt-3">Create Referance Value</h4>

          <h4 className="mt-3">Tag Position Head/Department head</h4>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}
