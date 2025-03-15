import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBCollapse, MDBCollapseHeader } from "mdbreact";
import { currency } from "../../../../../../../services/utilities";

export default function Payments() {
  const { total, collections } = useSelector(({ deals }) => deals);
  const [isOpen, setIsOpen] = useState(true);

  localStorage.setItem("payments", JSON.stringify(collections));
  console.log(collections);

  // Optimize calculations using useMemo
  const paymentTotals = useMemo(() => {
    return collections.reduce(
      (acc, payment) => {
        acc[payment.payment] = (acc[payment.payment] || 0) + payment.amount;
        return acc;
      },
      { cash: 0, gcash: 0, vouchers: 0, pending: 0 }
    );
  }, [collections]);

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
            <strong className="text-primary">
              {currency(paymentTotals.cash)}
            </strong>
          </div>
          <div className="d-flex justify-content-between border-bottom py-2">
            <span>Gcash :</span>
            <strong className="text-primary">
              {currency(paymentTotals.gcash)}
            </strong>
          </div>
          <div className="d-flex justify-content-between border-bottom py-2">
            <span>Vouchers :</span>
            <strong className="text-primary">
              {currency(paymentTotals.vouchers)}
            </strong>
          </div>
          <div className="d-flex justify-content-between border-bottom py-2">
            <span>Downpayment:</span>
            <strong className="text-danger">
              {currency(paymentTotals.pending)}
            </strong>
          </div>
          <div className="d-flex justify-content-between border-bottom py-2">
            <span>Balance:</span>
            <strong className="text-danger">
              {currency(paymentTotals.pending)}
            </strong>
          </div>
          <hr />
          <div className="d-flex justify-content-between border-bottom pb-2">
            <span>Total :</span>
            <strong className="text-success">{currency(total)}</strong>
          </div>
        </MDBCardBody>
      </MDBCollapse>
    </MDBCard>
  );
}
