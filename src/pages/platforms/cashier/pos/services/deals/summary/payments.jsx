import React from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBCardHeader, MDBCardFooter } from "mdbreact";
import { currency } from "../../../../../../../services/utilities";

export default function Payments() {
  const { total } = useSelector((deals) => deals);
  return (
    <MDBCard className="shadow-sm">
      <MDBCardHeader className="text-center text-uppercase font-weight-bold text-primary bg-light">
        Payments Summary
      </MDBCardHeader>
      <MDBCardBody>
        <div className="d-flex justify-content-between">
          <span>Floating Cash:</span>
          <strong className="text-warning">₱0.00</strong>
        </div>
        <div className="d-flex justify-content-between border-bottom py-2">
          <span>Cash :</span>
          <strong className="text-primary">₱0.00</strong>
        </div>
        <div className="d-flex justify-content-between border-bottom py-2">
          <span>Gcash :</span>
          <strong className="text-primary">₱0.00</strong>
        </div>
        <div className="d-flex justify-content-between border-bottom py-2">
          <span>Vouchers :</span>
          <strong className="text-primary">₱0.00</strong>
        </div>
        <div className="d-flex justify-content-between border-bottom py-2">
          <span>Pending Amount:</span>
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
