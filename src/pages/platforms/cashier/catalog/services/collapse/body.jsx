import React from "react";
import {
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
} from "mdbreact";

export default function Collapsable({ service }) {
  const { ssx, preparation, specimen, department } = service;

  const formattedPreparation =
    !preparation ||
    preparation.toLowerCase() === "none" ||
    preparation.toLowerCase() === "n/a"
      ? "No special preparations needed"
      : preparation;

  const formattedDepartment =
    department === "LAB"
      ? "Laboratory"
      : department === "RAD"
      ? "Radiology"
      : department;

  return (
    <MDBRow className="g-3">
      <MDBCol md="6">
        <MDBCard className="mb-3 shadow-sm">
          <MDBCardBody>
            <MDBCardTitle className="text-primary">Preparation</MDBCardTitle>
            <MDBCardText>{formattedPreparation}</MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol md="6">
        <MDBCard className="mb-3 shadow-sm">
          <MDBCardBody>
            <MDBCardTitle className="text-primary">
              Signs and Symptoms
            </MDBCardTitle>
            <MDBCardText>{ssx || "N/A"}</MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol md="6">
        <MDBCard className="mb-3 shadow-sm">
          <MDBCardBody>
            <MDBCardTitle className="text-primary">Department</MDBCardTitle>
            <MDBCardText>{formattedDepartment || "N/A"}</MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol md="6">
        <MDBCard className="mb-3 shadow-sm">
          <MDBCardBody>
            <MDBCardTitle className="text-primary">Specimen</MDBCardTitle>
            <MDBCardText>{specimen || "N/A"}</MDBCardText>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  );
}
