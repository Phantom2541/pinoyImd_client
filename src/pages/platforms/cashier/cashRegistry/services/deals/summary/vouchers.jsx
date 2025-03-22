import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBCardBody, MDBCollapseHeader, MDBCollapse } from "mdbreact";
import { currency } from "../../../../../../../services/utilities";
import { Statements } from "../../../../../../../services/fakeDb";
import { Daily } from "./../../../../../../../services/redux/slices/finance/journals/payments";
import SummaryLoading from "./loading";

export default function Vouchers() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { filtered = [], isLoading } = useSelector(({ payments }) => payments),
    [isOpen, setIsOpen] = useState(true),
    [total, setTotal] = useState(0),
    dispatch = useDispatch();

  // useEffect(() => {
  //   if (token) {
  //     const date = new Date().toISOString().split("T")[0];
  //     dispatch(
  //       Daily({
  //         token,
  //         key: {
  //           branchId: activePlatform.branchId,
  //           payor: auth._id,
  //           date,
  //         },
  //       })
  //     );
  //   }
  // }, [token, dispatch, activePlatform.branchId, auth._id]);

  //commented by darrel
  // useEffect(() => {
  //   let amount = 0;
  //   filtered?.forEach((voucher) => {
  //     amount += voucher.amount;
  //   });
  //   setTotal(amount);
  // }, [filtered]);
  useEffect(() => {
    if (filtered.length > 0) {
      const amount =
        filtered?.reduce((sum, voucher) => sum + voucher.amount, 0) || 0;
      setTotal(amount);
    }
  }, [filtered]);

  return (
    <MDBCard className="shadow-sm mb-2">
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
          {!isLoading ? (
            <>
              {filtered?.map((voucher) => (
                <div
                  className="d-flex justify-content-between border-bottom py-2"
                  key={`voucher-${voucher._id}`}
                >
                  <span>{Statements.getName(voucher.fsId)}</span>
                  <strong className="text-primary">
                    {currency(voucher.amount)}
                  </strong>
                </div>
              ))}
              <div className="d-flex justify-content-between border-bottom pb-2 mt-3">
                <span>Total Received:</span>
                <strong className="text-success">{currency(total)}</strong>
              </div>
            </>
          ) : (
            <SummaryLoading rowCount={2} />
          )}
        </MDBCardBody>
      </MDBCollapse>
    </MDBCard>
  );
}
