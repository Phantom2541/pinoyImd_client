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
  RESET_CARDHOLDER,
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
import Credit from "./credit";

const _refNo = {
  number: "",
  amount: 0,
  pp: "cash", //cash or credit patient Payable
  careOf: {
    category: "employee",
    user: "",
  },
};

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
    [refNo, setRefNo] = useState(_refNo),
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
    amount = Math.round((gross || 0) - (discount || 0)),
    { abbr = undefined } = Categories[category],
    providedPaymentOptions =
      Payments[cardHolder?.type ? cardHolder?.type : abbr];

  const isMixed = payment === "mixed";

  useEffect(() => {
    setPayment(
      ["mbs", "wls", "ctr"].includes(cardHolder?.type) ? "voucher" : "cash"
    );
  }, [cardHolder]);

  const checkout = async () => {
    const { careOf, pp, amount: rAmount, ...rest } = refNo;

    const baseRefNo = {
      ...rest,
      amount:
        pp === "co" || payment === "voucher"
          ? amount
          : rAmount > amount
          ? amount
          : rAmount,
      ...(pp === "co" && { careOf }),
    };
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
      ...(baseRefNo?.amount > 0 && {
        refNo: baseRefNo,
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
      dispatch(RESET_CARDHOLDER());
      dispatch(SETCART());
      setRefNo(_refNo);
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

  const showAlert = (text) => {
    return Swal.fire({
      title: "Company Card Needed",
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
    const { type = "", company = { name: "", ref: "" } } = cardHolder || {};
    const { name = "", ref = "" } = company || {};
    const { careOf = {}, pp = "" } = refNo;

    if (pp === "co" && !careOf.user) {
      const category = {
        bm: "Board Member",
        employee: "Employee",
        physician: "Physician",
      };
      return Swal.fire({
        icon: "warning",
        title: `${category[careOf.category]} Required`,
        text: `Please select a ${
          category[careOf.category]
        } who will take care of this credit transaction.`,
        confirmButtonText: "Got it",
        confirmButtonColor: "#3085d6",
        backdrop: true,
      });
    }
    if (type === "ctr" && !ref) {
      return showAlert(
        "Please select a company card for the Card Holder contract before continuing."
      );
    }

    if (type === "mbs" && !ref) {
      return showAlert(
        "Please select a company card  for the Card Holder Membership before continuing."
      );
    }

    if (type === "wls" && !name) {
      return showAlert(
        "Please select a company card  for the HMO Card Holder before continuing."
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
            <td style={{ fontSize: "1rem" }}>Gross Amount</td>
            <td className="table-price">
              <div className="d-flex justify-content-end">
                <RollingNumber value={gross} duration={1000} />
              </div>
            </td>
            {/* <td className="table-price">{currency.format(gross)}</td> */}
          </tr>
          <tr>
            <td style={{ fontSize: "1rem" }}>Discount</td>
            <td className="table-price">
              <div className="d-flex justify-content-end">
                <RollingNumber value={discount} duration={1000} />
              </div>
            </td>
            {/* <td className="table-price">{currency.format(discount)}</td> */}
          </tr>
          <tr>
            <td style={{ fontSize: "1rem" }}>Net Amount</td>
            <td className="table-price">
              <div className="d-flex justify-content-end">
                <RollingNumber value={amount} duration={1000} />
              </div>
            </td>
            {/* <td className="table-price">{currency.format(amount)}</td> */}
          </tr>
          <tr>
            <td style={{ fontSize: "1rem" }}>Payment</td>
            <td className="p-0">
              <select
                value={payment}
                onChange={({ target }) => {
                  setPayment(target.value);
                  setRefNo(_refNo);
                }}
              >
                {providedPaymentOptions?.map((payment, index) => (
                  <option key={`${abbr}-${index}`} value={payment}>
                    {capitalize(payment === "mixed" ? "Split Bill" : payment)}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          {isMixed && (
            <>
              {[
                { label: "Tracking No.", key: "number" },
                ...(refNo.pp === "cash"
                  ? [
                      {
                        label: "Credit Covered",
                        key: "amount",
                        ph: "Credit Covered",
                      },
                    ]
                  : []),
              ].map(({ label, key, ph = "" }, index) => (
                <tr>
                  <td style={{ fontSize: "0.8rem" }}>{label}</td>
                  <td className="p-0 m-0">
                    <input
                      type={index === 1 ? "number" : "string"}
                      value={String(refNo[key] || "")}
                      onChange={({ target }) =>
                        setRefNo({
                          ...refNo,
                          [key]:
                            index === 1 ? Number(target.value) : target.value,
                        })
                      }
                      placeholder={ph ? ph : label}
                      required
                      name={key}
                      title={label}
                    />
                  </td>
                </tr>
              ))}
            </>
          )}
          {isMixed ? (
            <tr>
              <td style={{ fontSize: "0.8rem" }}>Patient Payable</td>
              <td className="p-0">
                <select
                  value={refNo.pp}
                  onChange={({ target }) =>
                    setRefNo({ ...refNo, pp: target.value })
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="co">Care Of</option>
                </select>
              </td>
            </tr>
          ) : (
            ""
          )}

          <Credit
            refNo={refNo}
            setRefNo={setRefNo}
            isMixed={isMixed}
            amount={amount}
          />

          {["cash", "mixed", "downpayment"].includes(payment) &&
          refNo.pp === "cash" &&
          refNo.amount < amount ? (
            <tr>
              <td style={{ fontSize: "1rem" }}>Amount ₱</td>
              <td className="p-0">
                <input
                  type="number"
                  min={isMixed ? amount - refNo.amount : amount}
                  value={String(cash || "")}
                  onChange={({ target }) => setCash(Number(target.value))}
                  placeholder={
                    isMixed
                      ? `Amount ${currency.format(amount - refNo.amount)}`
                      : "Amount"
                  }
                  required
                  title={
                    isMixed
                      ? `Amount ${currency.format(amount - refNo.amount)}`
                      : "Amount "
                  }
                  name="amount"
                />
              </td>
            </tr>
          ) : (
            ""
          )}

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
