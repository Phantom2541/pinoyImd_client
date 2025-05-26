import React from "react";
import { useSelector } from "react-redux";
import { MDBRow, MDBCol } from "mdbreact";
import { currency, dateFormat, fullName } from "../../../services/utilities";
export default function Header() {
  const { cashier, updatedAt, department, expenses, opening, patients, shift } =
    useSelector(({ remittances }) => remittances.selected);

  return (
    <div className="px-1">
      <MDBRow>
        <MDBCol md="8" style={{ alignItems: "baseline" }} className="d-flex">
          Cashier :&nbsp;
          <h5 className="mb-0 fw-bold">
            <u>{fullName(cashier?.fullName)}</u>
          </h5>
        </MDBCol>
        <MDBCol className="text-right">
          <span>Date: {dateFormat(updatedAt)}</span>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol md="8" style={{ alignItems: "baseline" }} className="d-flex">
          Department :&nbsp;
          <u>{department}</u>
        </MDBCol>
        <MDBCol className="text-right">
          Shift :&nbsp;
          <u>{shift}</u>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol className="d-flex">
          Expenses :&nbsp;
          <u>{currency(expenses)}</u>
        </MDBCol>
        <MDBCol
          md="8"
          style={{ alignItems: "baseline" }}
          className="text-right"
        >
          Patients :&nbsp;
          <u>{patients}</u>
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol className="d-flex">
          Floating Cash :&nbsp;
          <u>{currency(opening.sum)}</u>
        </MDBCol>
      </MDBRow>
    </div>
  );
}
