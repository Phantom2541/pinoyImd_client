import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBCollapseHeader, MDBCollapse } from "mdbreact";
import { currency } from "../../../../../../../services/utilities";

export default function Vouchers() {
  const { total } = useSelector(({ deals }) => deals),
    [isOpen, setIsOpen] = useState(true);
  return (
    <MDBCard className="shadow-sm">
      <MDBCollapseHeader style={{ borderRadius: "50%" }} className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-uppercase font-weight-bold text-center text-primary">
            Vouchers Summary
          </small>
          <i
            onClick={() => setIsOpen(!isOpen)}
            style={{ rotate: `${isOpen ? 0 : 90}deg` }}
            className="fa fa-angle-down transition-all "
          />
        </div>
      </MDBCollapseHeader>
      <MDBCollapse isOpen={isOpen}>
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
          {/* <div className="d-flex justify-content-between border-bottom py-2">
          <span>Miscellanious :</span>
          <strong className="text-danger">₱0.00</strong>
        </div> */}
          <hr />
          <div className="d-flex justify-content-between border-bottom pb-2">
            <span>Total Received:</span>
            <strong className="text-success">{currency(total)}</strong>
          </div>
        </MDBCardBody>
      </MDBCollapse>
      {/* <MDBCardFooter className="bg-light border-top pt-3">
        <div className="d-flex justify-content-between">
          <span>Total:</span>
          <strong className="text-primary">{currency(total)}</strong>
        </div>
      </MDBCardFooter> */}
    </MDBCard>
  );
}
