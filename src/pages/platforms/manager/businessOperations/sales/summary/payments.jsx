import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBCollapse, MDBCollapseHeader } from "mdbreact";
import { currency } from "./../../../../../../services/utilities";
import SummaryLoading from "../../../../cashier/cashRegistry/services/deals/summary/loading";

export default function Payments() {
  const { filtered: collections, isLoading } = useSelector(
    ({ deals }) => deals
  );
  const [isOpen, setIsOpen] = useState(true);

  // Optimize calculations using useMemo
  const { paymentTotals, deletedTotal, grossSales, totalDiscount } =
    useMemo(() => {
      return collections?.reduce(
        (acc, payment) => {
          if (!payment.deletedAt) {
            acc.grossSales += payment.amount;
            acc.totalDiscount += payment.discount || 0; // Add discount total
            acc.paymentTotals[payment.payment] =
              (acc.paymentTotals[payment.payment] || 0) + payment.amount;
          } else {
            acc.deletedTotal += payment.amount;
          }
          return acc;
        },
        {
          paymentTotals: { cash: 0, gcash: 0, vouchers: 0, pending: 0 },
          deletedTotal: 0,
          grossSales: 0,
          totalDiscount: 0, // Initialize discount total
        }
      );
    }, [collections]);

  return (
    <>
      <MDBCard className="shadow-sm mb-2">
        <MDBCollapseHeader style={{ borderRadius: "50%" }} className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-uppercase font-weight-bold text-center text-primary">
              Payments Summary
            </small>
            <i
              onClick={() => setIsOpen(!isOpen)}
              style={{ rotate: `${isOpen ? 0 : 90}deg` }}
              className="fa fa-angle-down transition-all"
            />
          </div>
        </MDBCollapseHeader>
        <MDBCollapse isOpen={isOpen}>
          <MDBCardBody className="pt-2">
            {!isLoading ? (
              <>
                <div className="d-flex justify-content-between border-bottom py-2">
                  <span>Cash :</span>
                  <strong className="text-primary">
                    {currency.format(paymentTotals.cash)}
                  </strong>
                </div>
                <div className="d-flex justify-content-between border-bottom py-2">
                  <span>Gcash :</span>
                  <strong className="text-primary">
                    {currency.format(paymentTotals.gcash)}
                  </strong>
                </div>
                <div className="d-flex justify-content-between border-bottom py-2">
                  <span>Vouchers :</span>
                  <strong className="text-primary">
                    {currency.format(paymentTotals.vouchers)}
                  </strong>
                </div>
                <div className="d-flex justify-content-between border-bottom py-2">
                  <span>Downpayment:</span>
                  <strong className="text-danger">
                    {currency.format(paymentTotals.pending)}
                  </strong>
                </div>
                <div className="d-flex justify-content-between border-bottom py-2">
                  <span>Discount:</span>
                  <strong className="text-danger">
                    {currency.format(totalDiscount)}
                  </strong>
                </div>
                <hr />
                <div className="d-flex justify-content-between border-bottom pb-2">
                  <span>Gross Sales :</span>
                  <strong className="text-info">
                    {currency.format(grossSales)}
                  </strong>
                </div>
              </>
            ) : (
              <SummaryLoading />
            )}
          </MDBCardBody>
        </MDBCollapse>
      </MDBCard>
      {deletedTotal > 0 && (
        <MDBCard className="shadow-sm mb-2 bg-danger text-white">
          <MDBCardBody className="pt-2">
            <div className="d-flex justify-content-between border-bottom py-2">
              <span>Deleted Transactions:</span>
              <strong>{currency.format(deletedTotal)}</strong>
            </div>
          </MDBCardBody>
        </MDBCard>
      )}
    </>
  );
}
