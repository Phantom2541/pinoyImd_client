import React, { useEffect, useState } from "react";
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
      membership,
      hmo,
      contract,
      formSubmitted = false,
    } = useSelector(({ pos }) => pos),
    [isPickup, setIsPickup] = useState(true),
    [payment, setPayment] = useState("cash"),
    [cash, setCash] = useState(0),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const { gross = 0, discount = 0 } = computeGD(
      cart,
      category,
      privilege,
      membership,
      hmo,
      contract
    ),
    amount = (gross || 0) - (discount || 0),
    { abbr = undefined } = Categories[category],
    providedPaymentOptions = Payments[abbr];

  useEffect(() => {
    setPayment(["mbs", "wls", "ctr"].includes(abbr) ? "voucher" : "cash");
  }, [abbr]);

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
      hmo,
      cash,
      amount,
      discount,
      isPickup,
      department,
      privilege,
      customer,
      cashier: auth?.fullName,
      isPrint: true,
      cart: cart.map((menu) => {
        const {
            description,
            abbreviation,
            capital,
            packages = [],
            _id,
            isNew,
            discount: soldDiscount,
          } = menu,
          { up } = computeGD(menu, category, privilege, membership, hmo);

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
      addToast("Transaction completed successfully", { appearance: "info" });
    } catch (error) {
      addToast("Transaction failed", { appearance: "error" });
    } finally {
      setCash(0);
      dispatch(RESET());
      dispatch(RESET_INSOURCE());
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
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
              <RollingNumber value={gross} duration={1000} />
            </td>
            {/* <td className="table-price">{currency.format(gross)}</td> */}
          </tr>
          <tr>
            <td>Discount</td>
            <td className="table-price">
              <RollingNumber value={discount} duration={1000} />
            </td>
            {/* <td className="table-price">{currency.format(discount)}</td> */}
          </tr>
          <tr>
            <td>Net Amount</td>
            <td className="table-price">
              <RollingNumber value={amount} duration={1000} />
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
                    {capitalize(payment)}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              {["cash", "downpayment"].includes(payment) && abbr !== "wls" ? (
                <input
                  type="number"
                  min={amount}
                  value={String(cash)}
                  onChange={({ target }) => setCash(Number(target.value))}
                  placeholder="Amount in Peso"
                  required
                  name="amount"
                />
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
