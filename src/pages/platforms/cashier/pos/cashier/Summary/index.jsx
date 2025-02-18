import { MDBBtn } from "mdbreact";
import React, { useState } from "react";
import {
  capitalize,
  computeGD,
  currency,
} from "../../../../../../services/utilities";
import { Categories, Payments } from "../../../../../../services/fakeDb";
import { SAVE } from "../../../../../../services/redux/slices/commerce/sales";
// import { UPDATE as PATIENTUPDATE } from "../../../../../../services/redux/slices/assets/persons/users";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import Months from "../../../../../../services/fakeDb/calendar/months";

export default function Summary() {
  const { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    { category, privilege, physicianId, sourceId, cart } = useSelector(
      ({ checkout }) => checkout
    ),
    [isPickup, setIsPickup] = useState(true),
    [payment, setPayment] = useState(0),
    dispatch = useDispatch();

  const { gross = 0, discount = 0 } = computeGD(cart, category, privilege),
    amount = gross - discount,
    { abbr = "" } = Categories[category],
    paymentOptions = Payments[abbr];

  const handleCheckout = (e) => {
    e.preventDefault();

    const cash = Number(e.target.cash.value),
      today = new Date();

    const data = {
      // exact date used for pre calculated daily sale
      date: {
        month: Months[today.getMonth()],
        day: today.getDate(),
        year: today.getFullYear(),
      },
      // saleId: saleId || undefined,
      // source: sourceVendor || undefined,
      physicianId: physicianId || undefined,
      source: sourceId || undefined,
      // authorizedBy: authorizedBy || undefined,
      // category: category === 0 ? "walkin" : abbr,
      // payment: paymentOptions[payment],
      // cash,
      // amount,
      // discount,
      // isPickup,
      // customer,
      // cashier: auth?.fullName,
      // isPrint: true,
      cart: cart.map((menu) => {
        const {
            description,
            abbreviation,
            capital,
            packages = [],
            _id,
            isNew,
            up: soldUp,
            discount: soldDiscount,
          } = menu,
          { up, discount } = computeGD(menu, category, privilege);

        return {
          capital,
          description: String(description).toUpperCase(),
          abbreviation,
          packages,
          menuId: _id,
          isNew,
          up: isNew ? up : soldUp,
          discount: isNew ? discount : soldDiscount,
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

    // if (customer?.privilege !== privilege)
    //   dispatch(
    //     PATIENTUPDATE({
    //       token,
    //       data: { _id: customerId, privilege: privilege },
    //     })
    //   );

    // dispatch(
    //   SAVE({
    //     token,
    //     data,
    //   })
    // );

    // resetCustomer();
    e.target.reset();
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
                onChange={({ target }) => setPayment(Number(target.value))}
              >
                {paymentOptions?.map((payment, index) => (
                  <option key={`${abbr}-${index}`} value={index}>
                    {capitalize(payment)}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <input
                type="number"
                min={amount}
                placeholder="Amount in Peso"
                required
                name="cash"
              />
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
        // disabled={!patronPresent || !cart.length}
        className="m-0 w-100 fw-bold mt-4"
        color="success"
      >
        Complete Transaction
      </MDBBtn>
    </form>
  );
}
