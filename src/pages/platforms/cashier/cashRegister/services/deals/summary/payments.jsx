import React, { useState } from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBCollapse, MDBCollapseHeader } from "mdbreact";
import { currency } from "../../../../../../../services/utilities";

export default function Payments() {
  const { total } = useSelector(({ deals }) => deals);
  const [isOpen, setIsOpen] = useState(true);
  return (
    <MDBCard className="shadow-sm mb-2 ">
      <MDBCollapseHeader style={{ borderRadius: "50%" }} className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-uppercase font-weight-bold text-center text-primary">
            Payments Summary
          </small>
          <i
            onClick={() => setIsOpen(!isOpen)}
            style={{ rotate: `${isOpen ? 0 : 90}deg` }}
            className="fa fa-angle-down transition-all "
          />
        </div>
      </MDBCollapseHeader>
      <MDBCollapse isOpen={isOpen}>
        <MDBCardBody className="pt-2">
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
            <span>Total :</span>
            <strong className="text-success">{currency(total)}</strong>
          </div>
        </MDBCardBody>
      </MDBCollapse>
      {/* <MDBCardHeader className="text-center text-uppercase font-weight-bold text-primary bg-light">
        Payments Summary
      </MDBCardHeader>
      <MDBCardBody>
       
      </MDBCardBody> */}
      {/* <MDBCardFooter className="bg-light border-top pt-3">
        <div className="d-flex justify-content-between">
          <span>COH:</span>
          <strong className="text-primary">{currency(total)}</strong>
        </div>
      </MDBCardFooter> */}
    </MDBCard>
  );
}
