import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { currency, fullName } from "../../../../../../services/utilities";
import { Privileges } from "../../../../../../services/fakeDb";
export default function Collapsable({ deals }) {
  return (
    <MDBTable bordered>
      <MDBTableHead>
        <tr>
          <th>#</th>
          <th>Customer</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Discount</th>
          <th>Privilege</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {deals?.map((deal, index) => {
          const { customerId, category, amount, discount, privilege } = deal;
          return (
            <tr key={index}>
              <td className="fw-bold mb-1">{++index}</td>
              <td className="mb-1">{fullName(customerId?.fullName)}</td>
              <td className="mb-1">{category}</td>
              <td className="mb-1">{currency(amount)}</td>
              <td className="mb-1">{currency(discount)}</td>
              <td className="mb-1">{Privileges[privilege]}</td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
