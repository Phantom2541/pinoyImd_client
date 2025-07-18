import React from "react";
import { MDBInput, MDBRow, MDBCol } from "mdbreact";

export default function CostBreakdown({ handleChange, handleValue }) {
  return (
    <>
      {/* 🔵 Capital Section */}
      <h6 className="mt-3 font-weight-bold">Capital Breakdown</h6>
      <MDBRow>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="Pre-analytical"
            title="Gastos bago ang test tulad ng syringes, tubes, forms, at phlebotomy"
            value={handleValue("capital.Pre")}
            onChange={(e) => handleChange("capital.Pre", e.target.value)}
          />
        </MDBCol>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="Analytical"
            title="Gastos habang ginagawa ang test — reagents, machine use, tech time"
            value={handleValue("capital.Ana")}
            onChange={(e) => handleChange("capital.Ana", e.target.value)}
          />
        </MDBCol>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="Post-analytical"
            title="Gastos pagkatapos ng test — printing, validation, release, storage"
            value={handleValue("capital.Pos")}
            onChange={(e) => handleChange("capital.Pos", e.target.value)}
          />
        </MDBCol>
      </MDBRow>

      {/* 🔴 Expenses Section */}
      <h6 className="mt-4 font-weight-bold">Other Expenses</h6>
      <MDBRow>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="Technical Fee (TF)"
            title="Bayad sa nagsagawa ng procedure (e.g., sonologist, med tech)"
            value={handleValue("expenses.Tf")}
            onChange={(e) => handleChange("expenses.Tf", e.target.value)}
          />
        </MDBCol>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="Professional Fee (PF)"
            title="Bayad sa nagbasa o nag-interpret ng resulta (e.g., radiologist, pathologist)"
            value={handleValue("expenses.Pf")}
            onChange={(e) => handleChange("expenses.Pf", e.target.value)}
          />
        </MDBCol>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="Referral Fee (RF)"
            title="Incentive o share ng nag-refer ng pasyente (doktor o ahente)"
            value={handleValue("expenses.Rf")}
            onChange={(e) => handleChange("expenses.Rf", e.target.value)}
          />
        </MDBCol>
      </MDBRow>
    </>
  );
}
