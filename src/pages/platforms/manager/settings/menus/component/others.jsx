import React from "react";
import { MDBRow, MDBCol, MDBTabPane, MDBInput } from "mdbreact";
export default function Others({ handleChange, handleValue }) {
  return (
    <MDBTabPane tabId={"menu-3"}>
      <MDBRow>
        <MDBCol md="6">
          <label>Is Profile </label>
          <select
            value={handleValue("isProfile")}
            onChange={(e) => handleChange("isProfile", e.target.value)}
            className="mb-0 form-control"
          >
            <option value={false}> False</option>
            <option value={true}> True</option>
          </select>
        </MDBCol>
        <MDBCol md="6">
          <label>On Promo </label>
          <select
            value={handleValue("onPromo")}
            onChange={(e) => handleChange("onPromo", e.target.value)}
            className="mb-0 form-control"
          >
            <option value={false}> False</option>
            <option value={true}> True</option>
          </select>
        </MDBCol>
        <MDBCol md="6">
          <label>Discountable </label>
          <select
            value={handleValue("hasDiscount")}
            onChange={(e) => handleChange("hasDiscount", e.target.value)}
            className="mb-0 form-control"
          >
            <option value={false}> False</option>
            <option value={true}> True</option>
          </select>
        </MDBCol>
        <MDBCol md="6">
          <label>Has Reseco ( Refferal cutoff ) </label>
          <select
            value={handleValue("hasReseco")}
            onChange={(e) => handleChange("hasReseco", e.target.value)}
            className="mb-0 form-control"
          >
            <option value={false}> False</option>
            <option value={true}> True</option>
          </select>
        </MDBCol>
        <MDBCol md="4">
          <MDBInput
            type="number"
            label="Refund"
            value={handleValue("refund")}
            onChange={(e) => handleChange("refund", e.target.value)}
          />
        </MDBCol>
      </MDBRow>
    </MDBTabPane>
  );
}
