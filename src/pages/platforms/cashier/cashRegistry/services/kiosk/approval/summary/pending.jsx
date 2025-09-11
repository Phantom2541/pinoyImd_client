import { MDBCol, MDBBtn, MDBIcon, MDBBtnGroup } from "mdbreact";
import {
  currency,
  dateFormat,
  fullName,
} from "../../../../../../../../services/utilities";
import { capitalize, isEmpty } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { HMO } from "../../../../../../../../services/fakeDb";
import Credit from "./credit";
import utils from "../utils";
import {
  ResetREFNO,
  SetCASH,
  SetPAYMENT,
  SetREFNO,
  TOGGLE,
} from "../../../../../../../../services/redux/slices/commerce/pos/services/kiosk";
import { UPDATE } from "../../../../../../../../services/redux/slices/commerce/pos/services/onBoardings";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const ApprovalSummary = ({ handleSubmit, handleApprove = () => {} }) => {
  const { token } = useSelector(({ auth }) => auth);
  const {
    selected,
    cart,
    payment,
    refNo,
    isAuthorization,
    cash = 0,
  } = useSelector(({ kiosk }) => kiosk);
  const { formSubmitted = false } = useSelector(
    ({ onBoardings }) => onBoardings
  );
  const {
    requirements,
    pid: customer,
    haveCard = false,
    isWalkin = false,
  } = selected || {};
  const { hmo } = requirements || {};
  const { healthCard = {} } = customer || {};
  const { gross, amount } = utils.compute.charges(cart, selected);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [decision, setDecision] = useState("");
  const dispatch = useDispatch();
  const setPayment = (value) => dispatch(SetPAYMENT(value));
  const setRefNo = (value) => dispatch(SetREFNO(value));

  const isMixed = payment === "mixed";
  const cashOut = utils.compute.cashOut(cart, selected);

  useEffect(() => {
    if (!Boolean(cashOut) && haveCard) {
      setPaymentMethods(["voucher"]);
    } else {
      setPaymentMethods([haveCard ? "voucher" : "cash", "mixed"]);
    }
  }, [cashOut, haveCard]);

  useEffect(() => {
    setDecision("");
  }, []);

  const handleDeny = async () => {
    const { value: reason } = await Swal.fire({
      title: `${fullName(selected?.pid?.fullName)}`,
      input: "textarea",
      inputLabel: "Reason for cancellation",
      inputPlaceholder: "Enter your reason here...",
      inputAttributes: {
        "aria-label": "Reason",
      },
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: "Submit",
      cancelButtonText: "Cancel",
      inputValidator: (value) => {
        if (!value) {
          return "You must provide a reason!";
        }
      },
    });

    if (reason) {
      setDecision("rejected");
      dispatch(
        UPDATE({
          token,
          data: {
            ...selected,
            reason,
            status: isAuthorization ? "denied" : "cancelled",
            isRemoved: true,
          },
        })
      ).then(() => dispatch(TOGGLE()));
    }
  };

  return (
    <MDBCol md={!isWalkin ? "4" : "5"}>
      <form onSubmit={handleSubmit}>
        <table className="summary-table">
          <thead>
            <tr>
              <th colSpan="2" className="th-custom">
                summary
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gross Amount</td>
              <td className="table-price text-right">
                {currency.format(gross)}
              </td>
            </tr>
            {haveCard && (
              <>
                <tr>
                  <td>Company</td>
                  <td className="table-price text-right">{HMO.getName(hmo)}</td>
                </tr>
                <tr>
                  <td>ID No.</td>
                  <td className="table-price text-right">
                    {isWalkin ? requirements?.cardId : healthCard?.id}
                  </td>
                </tr>
                <tr>
                  <td>Approval No.</td>
                  <td
                    className={`table-price ${
                      !isAuthorization && "text-right"
                    }`}
                  >
                    {isAuthorization ? (
                      <input
                        required
                        value={refNo.appNo}
                        onChange={({ target }) =>
                          setRefNo({ ...refNo, appNo: target.value })
                        }
                      />
                    ) : (
                      <span className="text-right">{refNo.appNo}</span>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Expiration</td>
                  <td
                    className={`table-price ${
                      !isAuthorization && "text-right"
                    }`}
                  >
                    {isAuthorization ? (
                      <input
                        type="date"
                        name="expiration"
                        required
                        value={refNo.exp}
                        onChange={({ target }) =>
                          setRefNo({ ...refNo, exp: target.value })
                        }
                      />
                    ) : (
                      <span className="text-right d-block">
                        {dateFormat(refNo.exp)}
                      </span>
                    )}
                  </td>
                </tr>
              </>
            )}
            <tr>
              <td>Payment</td>
              <td className="table-price">
                <select
                  value={payment}
                  onChange={({ target }) => {
                    setPayment(target.value);
                    dispatch(ResetREFNO());
                  }}
                >
                  {paymentMethods?.map((payment, index) => (
                    <option key={`${payment}-${index}`} value={payment}>
                      {capitalize(payment === "mixed" ? "Split Bill" : payment)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            {isMixed ? (
              <tr>
                <td>Patient Payable</td>
                <td>
                  <select
                    value={refNo.pp}
                    onChange={({ target }) =>
                      setRefNo({ ...refNo, pp: target.value })
                    }
                  >
                    {haveCard && <option value="cash">Cash</option>}
                    <option value="co">Care Of</option>
                  </select>
                </td>
              </tr>
            ) : (
              ""
            )}

            {isMixed &&
              refNo.pp === "cash" &&
              payment === "mixed" &&
              haveCard && (
                <tr>
                  <td>Cash Out</td>
                  <td className="p-0 text-right">
                    {isAuthorization ? (
                      currency.format(cashOut)
                    ) : (
                      <input
                        min={Number(cashOut)}
                        value={String(cash)}
                        type="number"
                        onChange={({ target }) =>
                          dispatch(SetCASH(Number(target.value)))
                        }
                        placeholder={`Cash out ${currency.format(cashOut)}`}
                      />
                    )}
                  </td>
                </tr>
              )}

            {payment === "cash" && (
              <tr>
                <td>Amount</td>
                <td>
                  <input
                    min={amount}
                    value={String(cash)}
                    type="number"
                    onChange={({ target }) =>
                      dispatch(SetCASH(Number(target.value)))
                    }
                  />
                </td>
              </tr>
            )}

            <Credit amount={amount} refNo={refNo} setRefNo={setRefNo} />
          </tbody>
        </table>
        <MDBBtnGroup className="w-100">
          <MDBBtn
            className="m-0  mt-3"
            block
            color="danger"
            disabled={formSubmitted}
            onClick={handleDeny}
          >
            {isAuthorization ? "Deny" : "Cancel"}
            {formSubmitted && decision === "rejected" && (
              <MDBIcon icon="spinner" className="ml-2" pulse />
            )}
          </MDBBtn>
          {!isAuthorization && (
            <MDBBtn
              type="button"
              onClick={(e) => {
                handleApprove(e);
                setDecision("approve");
              }}
              block
              disabled={isEmpty(cart) || formSubmitted}
              className="m-0  mt-3"
              color={!isAuthorization ? "primary" : "success"}
            >
              {!isAuthorization ? "Save" : "Approve"}
              {formSubmitted && decision === "approve" && (
                <MDBIcon icon="spinner" className="ml-2" pulse />
              )}
            </MDBBtn>
          )}
          <MDBBtn
            type="submit"
            block
            disabled={isEmpty(cart) || formSubmitted}
            className="m-0  mt-3"
            color="success"
          >
            {!isAuthorization ? "Post" : "Process"}
            {formSubmitted && (decision === "" || isAuthorization) && (
              <MDBIcon icon="spinner" className="ml-2" pulse />
            )}
          </MDBBtn>
        </MDBBtnGroup>
      </form>
    </MDBCol>
  );
};

export default ApprovalSummary;
