import React from "react";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import { capitalize, currency } from "../../../../../services/utilities";
import { Denominations } from "../../../../../services/fakeDb";

export default function RemmitanceForm({ title }) {
  //   return (
  //     <div className="rounded border">
  //       <div className="px-1"><strong>{capitalize(title)} Balance</strong></div>
  //       <div className="border-top px-1">Bills</div>
  //       <div className='d-flex bg-danger'>
  //       <div>100</div><div><MDBInput type='number' size='sm' className='py-0' /></div>
  //       </div>
  //       <div className="border-top px-1">Coins</div>
  //     </div>
  //   );
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
              <div className="pt-1 pl-2">{currency(Number(bill), true)}</div>
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
              <div className="pt-1 pl-2">{currency(Number(coin), true)}</div>
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
