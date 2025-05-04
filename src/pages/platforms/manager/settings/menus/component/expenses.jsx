import React from "react";
import { MDBInput, MDBRow, MDBCol } from "mdbreact";

export default function SRP({ handleChange, handleValue }) {
  return (
    <>
      <MDBRow>
        <MDBCol md="3">
          <MDBInput
            type="number"
            label="Capital"
            value={handleValue("capital")}
            onChange={(e) =>
              handleChange("capital", e.target.value.toLowerCase())
            }
            className="mb-0"
          />
        </MDBCol>
        <MDBCol md="3">
          <MDBInput
            type="number"
            label="Expenses"
            value={handleValue("expenses")}
            onChange={(e) =>
              handleChange("expenses", e.target.value.toLowerCase())
            }
            className="mb-0"
          />
        </MDBCol>
        <MDBCol md="3">
          <MDBInput
            type="number"
            label="Refund"
            value={handleValue("refund")}
            onChange={(e) => handleChange("refund", e.target.value)}
          />
        </MDBCol>
        <MDBCol md="3">
          <MDBInput
            type="number"
            label="Promo"
            value={handleValue("promo")}
            onChange={(e) => handleChange("promo", e.target.value)}
          />
        </MDBCol>
      </MDBRow>
    </>
  );
}
