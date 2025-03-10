import React from "react";
import { MDBCard, MDBCardBody, MDBCardHeader } from "mdbreact";

export default function Receivables() {
  return (
    <MDBCard>
      <MDBCardHeader tag="h3">Receivables</MDBCardHeader>
      <MDBCardBody>
        <p>
          This is a sample content for receivables. You can add your own
          components here.
        </p>
      </MDBCardBody>
    </MDBCard>
  );
}
