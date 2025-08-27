import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCard, MDBCardBody, MDBCollapseHeader, MDBCollapse } from "mdbreact";
import SummaryLoading from "../../../../cashier/cashRegistry/services/deals/summary/loading";
import { Statements } from "../../../../../../services/fakeDb";
import { currency } from "../../../../../../services/utilities";
import { SetCASHIER } from "../../../../../../services/redux/slices/finance/journals/payments";
const voucherSummary = {
  wls: 0,
  mbs: 0,
  ctr: 0,
};
export default function Vouchers() {
  const { filtered = [], isLoading } = useSelector(({ payments }) => payments),
    { filterByCashier } = useSelector(({ deals }) => deals),
    [isOpen, setIsOpen] = useState(true),
    [total, setTotal] = useState(0),
    dispatch = useDispatch();

  useEffect(() => {
    if (filtered.length > 0) {
      filtered.forEach((element) => {
        voucherSummary[element.category] += element.amount;
      });
      const amount =
        filtered?.reduce((sum, voucher) => sum + voucher.amount, 0) || 0;
      setTotal(amount);
    }
  }, [filtered]);

  useEffect(() => {
    dispatch(SetCASHIER(filterByCashier));
  }, [dispatch, filterByCashier]);

  if (!isLoading && filtered.length === 0) return null;

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
                    {currency.format(voucher.amount)}
                  </strong>
                </div>
              ))}
              <div className="d-flex justify-content-between border-bottom pb-2 mt-3">
                <span>Total Received:</span>
                <strong className="text-success">
                  {currency.format(total)}
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
