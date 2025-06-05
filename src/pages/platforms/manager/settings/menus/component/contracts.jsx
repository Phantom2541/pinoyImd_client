import React from "react";
import { MDBInput, MDBRow, MDBCol } from "mdbreact";

export default function SRP({ handleChange, handleValue }) {
  return (
    <MDBRow>
      <MDBCol md="4">
        <MDBInput
          type="number"
          label="SubContracting"
          value={handleValue("sbc")}
          onChange={(e) => handleChange("sbc", e.target.value)}
        />
      </MDBCol>
      <MDBCol md="4">
        <MDBInput
          type="number"
          label="Special SubContracting"
          value={handleValue("ssc")}
          onChange={(e) => handleChange("ssc", e.target.value)}
        />
      </MDBCol>
    </MDBRow>
  );
}
