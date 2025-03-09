import React from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBCardHeader, MDBCardFooter } from "mdbreact";
import { currency } from "../../../../../../../services/utilities";

export default function Vouchers() {
  const { total } = useSelector((deals) => deals);
  return (
    <MDBCard className="shadow-sm">
      <MDBCardHeader className="text-center text-uppercase font-weight-bold text-primary bg-light">
        Vouchers Summary
      </MDBCardHeader>
      <MDBCardBody>
        <div className="d-flex justify-content-between">
          <span>Electric Bill:</span>
          <strong className="text-warning">₱0.00</strong>
        </div>
        <div className="d-flex justify-content-between border-bottom py-2">
          <span>Water Bill :</span>
          <strong className="text-primary">₱0.00</strong>
        </div>
        <div className="d-flex justify-content-between border-bottom py-2">
          <span>Wifi Bill :</span>
          <strong className="text-primary">₱0.00</strong>
        </div>
        <div className="d-flex justify-content-between border-bottom py-2">
          <span>Miscellanious :</span>
          <strong className="text-danger">₱0.00</strong>
        </div>
        <hr />
        <div className="d-flex justify-content-between border-bottom pb-2">
          <span>Total Received:</span>
          <strong className="text-success">{currency(total)}</strong>
        </div>
      </MDBCardBody>
      <MDBCardFooter className="bg-light border-top pt-3">
        <div className="d-flex justify-content-between">
          <span>Total:</span>
          <strong className="text-primary">{currency(total)}</strong>
        </div>
      </MDBCardFooter>
    </MDBCard>
  );
}
