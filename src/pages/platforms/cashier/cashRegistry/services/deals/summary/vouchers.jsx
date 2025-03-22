import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBCard, MDBCardBody, MDBCollapseHeader, MDBCollapse } from "mdbreact";
import { currency } from "../../../../../../../services/utilities";
import { Statements } from "../../../../../../../services/fakeDb";
import { Daily } from "./../../../../../../../services/redux/slices/finance/journals/payments";

export default function Vouchers() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { filtered } = useSelector(({ payments }) => payments),
    [isOpen, setIsOpen] = useState(false),
    [total, setTotal] = useState(0),
    dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      const date = new Date().toISOString().split("T")[0];
      dispatch(
        Daily({
          token,
          key: {
            branchId: activePlatform.branchId,
            payor: auth._id,
            date,
          },
        })
      );
    }
  }, [token, dispatch, activePlatform.branchId, auth._id]);

  useEffect(() => {
    let amount = 0;
    filtered?.forEach((voucher) => (amount += voucher.amount));
    setTotal(amount);
  }, [filtered]);

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
          <hr />
          <div className="d-flex justify-content-between border-bottom pb-2">
            <span>Total Received:</span>
            <strong className="text-success">{currency(total)}</strong>
          </div>
        </MDBCardBody>
      </MDBCollapse>
    </MDBCard>
  );
}
