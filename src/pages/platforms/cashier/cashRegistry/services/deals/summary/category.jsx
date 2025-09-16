import { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBCollapse, MDBCollapseHeader } from "mdbreact";
import { currency } from "../../../../../../../services/utilities";
import {
  AUTOSELECT,
  SetSELECTED,
} from "../../../../../../../services/redux/slices/finance/bookkeeping/remittances";
import SummaryLoading from "./loading";

export default function Payments() {
  const {
    total,
    collections,
    dealsLoading: isLoading,
  } = useSelector(({ deals }) => deals);
  const { auth, activePlatform, token } = useSelector(({ auth }) => auth);
  const { selected } = useSelector(({ remittances }) => remittances);

  const [isOpen, setIsOpen] = useState(true);
  const [sum, setSum] = useState(0);
  const dispatch = useDispatch();

  // Reset voucherSummary and calculate based on collections
  const { paymentTotals, voucherSummary } = useMemo(() => {
    const totals = {
      cash: 0,
      gcash: 0,
      voucher: 0,
      pending: 0,
    };

    const summary = {
      wls: 0,
      mbs: 0,
      ctr: 0,
      care: 0,
    };

    collections?.forEach((item) => {
      const {
        payment,
        amount,
        refNo = { amount: 0 },
        cardHolder = { type: "" },
      } = item;
      const { careOf = {}, pp = "cash" } = refNo;
      const { type: chType = "" } = cardHolder;
      const isMixed = payment === "mixed" || payment === "voucher";
      const baseAmount = isMixed
        ? refNo?.amount + (careOf?.amount || 0)
        : amount;

      const totalsKey = isMixed ? "voucher" : payment;

      totals[totalsKey] = (totals[totalsKey] || 0) + baseAmount;

      if (isMixed && pp === "cash") {
        const mixedCash = amount - refNo?.amount;
        totals.cash += mixedCash || 0;
      }

      //patient payable is paid by care of
      if (isMixed && pp === "co") {
        summary["care"] += careOf?.amount || 0;
      }

      if (isMixed && chType && summary.hasOwnProperty(chType)) {
        summary[chType] += refNo?.amount || 0;
      }
    });

    return { paymentTotals: totals, voucherSummary: summary };
  }, [collections]);

  useEffect(() => {
    setSum(selected?.opening?.sum || 0);
  }, [selected]);

  useEffect(() => {
    // Get today's date in local format: YYYY-MM-DD
    const date = new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    dispatch(
      AUTOSELECT({
        token,
        key: {
          branch: activePlatform.branchId,
          cashier: auth._id,
          date,
        },
      })
    ).then(({ payload }) => {
      const { data } = payload;
      if (data) {
        localStorage.setItem("floatingcash", JSON.stringify(data));
        dispatch(SetSELECTED({ value: data }));
      }
    });
  }, [activePlatform, auth, token, dispatch]);

  return (
    <MDBCard className="shadow-sm my-2">
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
              <div className="d-flex justify-content-between">
                <span>Floating Cash:</span>
                <strong className="text-warning">
                  {selected ? currency.format(sum) : "-"}
                </strong>
              </div>

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
                  {currency.format(paymentTotals.voucher)}
                </strong>
              </div>

              <div className="d-flex justify-content-between border-bottom py-2 ml-3">
                <span title="Wellness">HMO :</span>
                <strong className="text-primary">
                  {currency.format(voucherSummary.wls)}
                </strong>
              </div>

              <div className="d-flex justify-content-between border-bottom py-2 ml-3">
                <span title="Insource : Membership">Membership :</span>
                <strong className="text-primary">
                  {currency.format(voucherSummary.mbs)}
                </strong>
              </div>

              <div className="d-flex justify-content-between border-bottom py-2 ml-3">
                <span title="Insource : Contracts">Contracts :</span>
                <strong className="text-primary">
                  {currency.format(voucherSummary.ctr)}
                </strong>
              </div>
              <div className="d-flex justify-content-between border-bottom py-2 ml-3">
                <span title="Insource : Contracts">Care Of :</span>
                <strong className="text-primary">
                  {currency.format(voucherSummary.care)}
                </strong>
              </div>

              <div className="d-flex justify-content-between border-bottom py-2">
                <span>Downpayment:</span>
                <strong className="text-danger">
                  {currency.format(paymentTotals.pending)}
                </strong>
              </div>

              <div className="d-flex justify-content-between border-bottom py-2">
                <span>Balance:</span>
                <strong className="text-danger">
                  {currency.format(paymentTotals.pending)}
                </strong>
              </div>

              <hr />
              <div className="d-flex justify-content-between border-bottom pb-2">
                <span>Total :</span>
                <strong className="text-success">
                  {currency.format(total + sum)}
                </strong>
              </div>
            </>
          ) : (
            <SummaryLoading />
          )}
        </MDBCardBody>
      </MDBCollapse>
    </MDBCard>
  );
}
