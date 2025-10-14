import { useEffect, useState } from "react";
import { MDBBtn } from "mdbreact";
import {
  allServicesHavePrices,
  capitalize,
  computeGD,
  currency,
  paymentMethod,
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
import utils from "./utils";
import Payment from "./payment";

const _refNo = {
  number: "",
  amount: 0,
  pp: "cash", //cash or credit patient Payable
  careOf: {
    category: "employee",
    number: "", //reference number for gcash
    user: "",
    amount: 0,
    pp: "gcash",
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
    [isVoucher, setIsVoucher] = useState(false),
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

  useEffect(() => {
    setPayment(
      ["mbs", "wls", "ctr"].includes(cardHolder?.type) ? "voucher" : "cash"
    );
    setRefNo({ ..._refNo, pp: "cash" });
  }, [cardHolder]);

  useEffect(() => {
    setIsVoucher(payment === "voucher");
  }, [payment]);
  const checkout = async () => {
    const baseRefNo = utils.build(refNo, payment, amount, cardHolder);
    const _cash =
      utils.hasCash(refNo, payment, amount) && payment !== "mixed" ? cash : 0;
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
      cash: _cash,
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
      ...(baseRefNo && {
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
    const balance = _cash - amount;

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
    const { careOf = {} } = refNo;
    if (
      careOf.pp === "co" &&
      !careOf.user &&
      (payment === "mixed" || payment === "voucher")
    ) {
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

  console.log("refNo", refNo);

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
          </tr>
          <tr>
            <td style={{ fontSize: "1rem" }}>Discount</td>
            <td className="table-price">
              <div className="d-flex justify-content-end">
                <RollingNumber value={discount} duration={1000} />
              </div>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: "1rem" }}>Net Amount</td>
            <td className="table-price">
              <div className="d-flex justify-content-end">
                <RollingNumber value={amount} duration={1000} />
              </div>
            </td>
          </tr>
          <tr>
            <td style={{ fontSize: "1rem" }}>Payment</td>
            <td className="p-0">
              <select
                value={payment}
                onChange={({ target }) => {
                  const _payment = target.value;
                  const { company = {} } = cardHolder || {};
                  const { name, ref } = company;
                  const isCardHolder = Boolean(name || ref);
                  const careOfPP =
                    _payment === "mixed"
                      ? "cash"
                      : isCardHolder ||
                        _payment === "cash" ||
                        _payment === "downpayment"
                      ? "cash"
                      : "co";

                  setPayment(_payment);
                  setRefNo({
                    ..._refNo,
                    pp: careOfPP,
                  });
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
          {["voucher", "mixed"].includes(payment) && (
            <Payment
              payment={payment}
              refNo={refNo}
              setRefNo={setRefNo}
              chargeAmount={amount}
              setCash={setCash}
              cash={cash}
            />
          )}

          {["cash", "downpayment", "voucher"].includes(payment) &&
          refNo.pp === "cash" &&
          (refNo?.amount < amount || !refNo.amount) ? (
            <tr>
              <td style={{ fontSize: "1rem" }}>Amount ₱</td>
              <td className="p-0">
                <input
                  type="number"
                  min={isVoucher ? amount - refNo.amount : amount}
                  value={String(cash || "")}
                  onChange={({ target }) => setCash(Number(target.value))}
                  placeholder={
                    isVoucher
                      ? `Amount ${currency.format(amount - refNo.amount)}`
                      : "Amount"
                  }
                  required
                  title={
                    isVoucher
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
