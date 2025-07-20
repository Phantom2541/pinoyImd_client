import React from "react";
import { MDBInput, MDBRow, MDBCol, MDBTabPane } from "mdbreact";

export default function SRP({ handleChange, handleValue }) {
  return (
    <MDBTabPane tabId={"menu-0"}>
      <MDBRow>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="SRP ( OPD/Walkin ) "
            value={handleValue("opd")}
            onChange={(e) => handleChange("opd", e.target.value)}
          />
        </MDBCol>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="Charity Ward"
            value={handleValue("cw")}
            onChange={(e) => handleChange("cw", e.target.value)}
          />
        </MDBCol>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="Emergency Room"
            value={handleValue("er")}
            onChange={(e) => handleChange("er", e.target.value)}
          />
        </MDBCol>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="Private Ward"
            value={handleValue("pw")}
            onChange={(e) => handleChange("pw", e.target.value)}
          />
        </MDBCol>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="Promo"
            value={handleValue("promo")}
            onChange={(e) => handleChange("promo", e.target.value)}
          />
        </MDBCol>
      </MDBRow>
      <MDBCol md="6">
        <MDBInput
          type="number"
          label="Health Maintenance Organization"
          value={handleValue("hmo")}
          onChange={(e) => handleChange("hmo", e.target.value.toLowerCase())}
          className="mb-0"
        />
      </MDBCol>
    </MDBTabPane>
  );
}
