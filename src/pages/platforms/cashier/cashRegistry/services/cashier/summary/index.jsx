import { useEffect, useState } from "react";
import { MDBBtn } from "mdbreact";
import {
  allServicesHavePrices,
  capitalize,
  computeGD,
  currency,
} from "../../../../../../../services/utilities";
import { Categories, Payments } from "../../../../../../../services/fakeDb";
import { UPDATE as PATIENTUPDATE } from "../../../../../../../services/redux/slices/assets/persons/users";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  RESET,
  RESET_INSOURCE,
  SAVE,
  SETCART,
} from "../../../../../../../services/redux/slices/commerce/pos/services/pos";
import { removeUndefinedValues } from "../../../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";
import { SetPrinting } from "../../../../../../../services/redux/slices/commerce/pos/services/deals";
import Spinner from "../../../../../../../components/spinner";
import { ADD_AFFILIATED } from "../../../../../../../services/redux/slices/assets/providers";
import { ADD_PHYSICIAN } from "../../../../../../../services/redux/slices/assets/persons/physicians";
import RollingNumber from "../../../../../../../components/rollingNumber";

export default function Summary() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    {
      cart,
      category,
      privilege,
      customer = {},
      physicianId,
      sourceId,
      ssx,
      authorizedBy,
      department,
      hmo,
      formSubmitted = false,
      cardHolder,
    } = useSelector(({ pos }) => pos),
    [isPickup, setIsPickup] = useState(true),
    [delayedShowCash, setDelayedShowCash] = useState(false),
    [refNo, setRefNo] = useState({ number: "", amount: 0 }),
    [payment, setPayment] = useState("cash"),
    [cash, setCash] = useState(0),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const { gross = 0, discount = 0 } = computeGD(
      cart,
      category,
      privilege,
      cardHolder
    ),
    amount = (gross || 0) - (Math.round(discount) || 0),
    { abbr = undefined } = Categories[category],
    providedPaymentOptions =
      Payments[cardHolder?.type ? cardHolder?.type : abbr];

  const showCash =
    payment === "cash" ||
    (payment === "mixed" && refNo.amount && amount > refNo.amount);

  const isMixed = payment === "mixed";

  useEffect(() => {
    setPayment(
      ["mbs", "wls", "ctr"].includes(cardHolder?.type) ? "voucher" : "cash"
    );
  }, [cardHolder]);

  useEffect(() => {
    let timer;

    if (isMixed && showCash) {
      // clear muna bago mag start ulit
      timer = setTimeout(() => {
        setDelayedShowCash(true);
      }, 500);
    } else {
      setDelayedShowCash(showCash); // agad mag false
    }

    return () => clearTimeout(timer); // clear kapag nagbago dependencies
  }, [isMixed, showCash, refNo.amount, amount]);

  const checkout = async () => {
    let selected = {
      physicianId: physicianId?.physician || undefined,
      source: sourceId || undefined,
      authorizedBy: authorizedBy || undefined,
      ssx: ssx || undefined,
      branchId: activePlatform.branchId,
      customerId: customer._id,
      cashierId: auth._id,
      category: category === 0 ? "wi" : abbr,
      payment,
      cash,
      amount,
      discount,
      isPickup,
      department,
      privilege,
      customer,
      cashier: auth?.fullName,
      isPrint: true,
      status: "pending",
      ...(cardHolder?.type && { cardHolder }),
      ...(refNo.amount > 0 && {
        refNo: {
          ...refNo,
          amount: refNo.amount > amount ? amount : refNo.amount,
        },
      }),
      cart: cart.map((menu) => {
        const {
            description,
            abbreviation,
            capital,
            packages = [],
            _id,
            isNew,
          } = menu,
          { up, discount: soldDiscount } = computeGD(
            menu,
            category,
            privilege,
            cardHolder
          );

        return {
          capital,
          description: String(description).toUpperCase(),
          abbreviation,
          packages,
          menuId: _id,
          isNew,
          up: up,
          discount: soldDiscount,
        };
      }),
    };
    const balance = cash - amount;
    if (balance > 0)
      Swal.fire({
        icon: "info",
        title: `Change: ${currency.format(balance)}`,
        text: "Please return the change to the customer.",
      });

    if (customer?.privilege !== privilege && privilege !== 4)
      dispatch(
        PATIENTUPDATE({
          token,
          data: { _id: customer._id, privilege },
        })
      );

    selected = removeUndefinedValues(selected);

    try {
      await dispatch(SAVE({ token, data: selected })).then(
        ({ payload: data }) => {
          const { payload, register } = data;
          selected._id = payload._id;

          dispatch(SetPrinting({ status: true, selected }));
          if (register.isRegister) {
            dispatch(ADD_AFFILIATED(register));
            dispatch(ADD_PHYSICIAN(register.physician));
          }
        }
      );

      dispatch(SETCART());
      setRefNo({ number: "", amount: 0 });
      addToast("Transaction completed successfully", { appearance: "info" });
    } catch (error) {
      addToast("Transaction failed", { appearance: "error" });
    } finally {
      setCash(0);
      dispatch(RESET());
      dispatch(RESET_INSOURCE());
      // 🔥 Dispatch the event
      window.dispatchEvent(new Event("reset-ui"));
    }
  };

  const showAlert = (title, text) => {
    return Swal.fire({
      title,
      text,
      icon: "warning",
      confirmButtonText: "Got it",
      confirmButtonColor: "#4CAF50",
      background: "#ffffff",
      backdrop: `rgba(0,0,0,0.4)`,
      allowOutsideClick: false,
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const { type = "", company = { name: "", ref: "" } } = cardHolder;
    const { name = "", ref = "" } = company;
    if (type === "ctr" && !ref) {
      return showAlert(
        "Source Needed",
        "Please select a source for the Card Holder contract before continuing."
      );
    }

    if (type === "mbs" && !ref) {
      return showAlert(
        "Source Needed",
        "Please select a source for the Card Holder Membership before continuing."
      );
    }

    if (type === "wls" && !name) {
      return showAlert(
        "Card Type Needed",
        "Please select a card type for the HMO Card Holder before continuing."
      );
    }

    if (!allServicesHavePrices(cart, category, hmo)) {
      Swal.fire({
        title: "Service Validator?",
        text: "Some services do not have a set price. Please double-check. If you're confident everything is correct, you may proceed. Note that the admin will be notified regarding this issue.",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await checkout();
        }
      });
    } else {
      await checkout();
    }
  };

  return (
    <form onSubmit={handleCheckout}>
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
            <td className="table-price">
              <div className="d-flex justify-content-end">
                <RollingNumber value={gross} duration={1000} />
              </div>
            </td>
            {/* <td className="table-price">{currency.format(gross)}</td> */}
          </tr>
          <tr>
            <td>Discount</td>
            <td className="table-price">
              <div className="d-flex justify-content-end">
                <RollingNumber value={discount} duration={1000} />
              </div>
            </td>
            {/* <td className="table-price">{currency.format(discount)}</td> */}
          </tr>
          <tr>
            <td>Net Amount</td>
            <td className="table-price">
              <div className="d-flex justify-content-end">
                <RollingNumber value={amount} duration={1000} />
              </div>
            </td>
            {/* <td className="table-price">{currency.format(amount)}</td> */}
          </tr>
          <tr>
            <td>Payment</td>
            <td className="p-0">
              <select
                value={payment}
                onChange={({ target }) => setPayment(target.value)}
              >
                {providedPaymentOptions?.map((payment, index) => (
                  <option key={`${abbr}-${index}`} value={payment}>
                    {capitalize(payment === "mixed" ? "Split Bill" : payment)}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              {["cash", "mixed", "downpayment"].includes(payment) &&
              abbr !== "wls" ? (
                <>
                  {isMixed && (
                    <>
                      <input
                        type="string"
                        min={amount}
                        value={refNo.number}
                        onChange={({ target }) =>
                          setRefNo({ ...refNo, number: target.value })
                        }
                        placeholder="Reference No."
                        required
                        name="ref"
                        title="Reference No."
                      />
                      <input
                        type="number"
                        value={String(refNo.amount || "")}
                        onChange={({ target }) =>
                          setRefNo({ ...refNo, amount: Number(target.value) })
                        }
                        placeholder="Voucher Amount"
                        required
                        name="refAmount"
                        title="Voucher Amount"
                      />
                    </>
                  )}
                  {delayedShowCash ? (
                    <input
                      type="number"
                      min={isMixed ? amount - refNo.amount : amount}
                      value={String(cash || "")}
                      onChange={({ target }) => setCash(Number(target.value))}
                      placeholder={
                        isMixed
                          ? `Cash out Bill ${currency.format(
                              amount - refNo.amount
                            )}`
                          : "Amount in Peso"
                      }
                      required
                      title={
                        isMixed
                          ? `Cash out Bill ${currency.format(
                              amount - refNo.amount
                            )}`
                          : "Amount in Peso"
                      }
                      name="amount"
                    />
                  ) : (
                    ""
                  )}
                </>
              ) : (
                <span>No cash input needed</span>
              )}
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="td-skip" />
          </tr>
          <tr>
            <td className="p-0">
              <button
                type="button"
                className={`type-of-transport ${isPickup && "active"}`}
                onClick={() => setIsPickup(true)}
              >
                Pick-up
              </button>
            </td>
            <td className="p-0">
              <button
                type="button"
                className={`type-of-transport ${!isPickup && "active"}`}
                onClick={() => setIsPickup(false)}
              >
                Deliver
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <MDBBtn
        type="submit"
        disabled={formSubmitted || !cart.length}
        className="m-0 w-100 fw-bold mt-4"
        color="success"
      >
        Complete Transaction <Spinner formSubmitted={formSubmitted} />
      </MDBBtn>
    </form>
  );
}
