import React from "react";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import { capitalize, currency } from "../../../../../../services/utilities";
import { Denominations } from "../../../../../../services/fakeDb";

export default function Modal({ title }) {
  return (
    <MDBTable bordered small>
      <MDBTableHead>
        <tr>
          <th scope="col" colSpan={2}>
            {capitalize(title)} Balance
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td colSpan={2}>Bills</td>
        </tr>
        <tr>
          <td>Type</td>
          <td className="text-center">Quantity</td>
        </tr>
        {Denominations.bills.map((bill) => (
          <tr key={`bill-${bill}`}>
            <td className="p-0">
              <div className="pt-1 pl-2">
                {currency.format(Number(bill), true)}
              </div>
            </td>
            <td className="p-0">
              <input
                type="number"
                min={0}
                className="w-100 text-center"
                required
              />
            </td>
          </tr>
        ))}
        <tr>
          <td>Total</td>
          <td></td>
        </tr>
        <tr>
          <td colSpan={2}>Coins</td>
        </tr>
        <tr>
          <td>Type</td>
          <td className="text-center">Quantity</td>
        </tr>
        {Denominations.coins.map((coin) => (
          <tr key={`coin-${coin}`}>
            <td className="p-0">
              <div className="pt-1 pl-2">
                {currency.format(Number(coin), true)}
              </div>
            </td>
            <td className="p-0">
              <input
                type="number"
                min={0}
                className="w-100 text-center"
                required
              />
            </td>
          </tr>
        ))}
        <tr>
          <td>Total</td>
          <td></td>
        </tr>
      </MDBTableBody>
    </MDBTable>
  );
}
