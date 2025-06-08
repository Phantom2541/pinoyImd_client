import React from "react";
import { MDBInput, MDBRow, MDBCol } from "mdbreact";

export default function SRP({ handleChange, handleValue }) {
  return (
    <MDBRow>
      <MDBCol md="6">
        <MDBInput
          type="number"
          label="Subcontract"
          value={handleValue("sbc")}
          onChange={(e) => handleChange("sbc", e.target.value)}
        />
      </MDBCol>
      <MDBCol md="6">
        <MDBInput
          type="number"
          label="Special Subcontract"
          value={handleValue("ssc")}
          onChange={(e) => handleChange("ssc", e.target.value)}
        />
      </MDBCol>
    </MDBRow>
  );
}
