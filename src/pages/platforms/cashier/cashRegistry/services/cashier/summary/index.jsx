import React, { useState } from "react";
import { MDBBtn } from "mdbreact";
import {
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
  SAVE,
  SETCART,
} from "../../../../../../../services/redux/slices/commerce/pos/services/pos";
import { removeUndefinedValues } from "../../../../../../../services/utilities";
import { useToasts } from "react-toast-notifications";

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
    } = useSelector(({ pos }) => pos),
    [isPickup, setIsPickup] = useState(true),
    [payment, setPayment] = useState("cash"),
    [cash, setCash] = useState(0),
    [loading, setLoading] = useState(false),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const { gross = 0, discount = 0 } = computeGD(
      cart,
      category,
      privilege,
      membership
    ),
    amount = gross - discount,
    { abbr = undefined } = Categories[category],
    providedPaymentOptions = Payments[abbr];

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (loading) return; // Prevent multiple clicks
    setLoading(true); // Disable button while saving

    let data = {
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
          { up } = computeGD(menu, category, privilege, membership);

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
        title: `Change: ${currency(balance)}`,
        text: "Please return the change to the customer.",
      });

    if (customer?.privilege !== privilege && privilege !== 4)
      dispatch(
        PATIENTUPDATE({
          token,
          data: { _id: customer._id, privilege },
        })
      );

    data = removeUndefinedValues(data);

    try {
      await dispatch(SAVE({ token, data })).unwrap(); // Ensure save completes before proceeding
      dispatch(SETCART());
      addToast("Transaction completed successfully", { appearance: "info" });
    } catch (error) {
      addToast("Transaction failed", { appearance: "error" });
    } finally {
      setLoading(false); // Re-enable the button after transaction
      setCash(0);
      setPayment(0);
      dispatch(RESET());
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
            <td className="table-price">{currency(gross)}</td>
          </tr>
          <tr>
            <td>Discount</td>
            <td className="table-price">{currency(discount)}</td>
          </tr>
          <tr>
            <td>Net Amount</td>
            <td className="table-price">{currency(amount)}</td>
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
              {["cash", "downpayment"].includes(payment) ? (
                <input
                  type="number"
                  min={amount}
                  value={cash}
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
        disabled={!customer || !cart.length}
        className="m-0 w-100 fw-bold mt-4"
        color="success"
      >
        Complete Transaction
      </MDBBtn>
    </form>
  );
}
