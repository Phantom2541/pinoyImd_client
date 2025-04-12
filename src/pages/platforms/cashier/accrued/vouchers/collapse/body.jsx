import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { currency, fullName } from "../../../../../../services/utilities";
import { Privileges } from "../../../../../../services/fakeDb";
export default function Collapsable({ deals, handleSelect }) {
  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          <th>Source</th>
          <th>Customer</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Discount</th>
          <th>Privilege</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {deals?.map((deal, index) => {
          const { customerId, category, amount, discount, privilege, source } =
            deal;
          return (
            <tr key={index}>
              <td>{source?.displayname}</td>
              <td>
                <div className=" d-flex align-items-center">
                  <input
                    className="form-check-input m-0 p-0"
                    type="checkbox"
                    id={deal._id}
                    onChange={() => handleSelect(deal)}
                  />
                  <label
                    htmlFor={deal._id}
                    style={{ marginRight: "-0.5rem" }}
                    className="form-check-label label-table"
                  >
                    <span className="fw-bold mr-1"> {++index}.</span>
                    {fullName(customerId?.fullName)}
                  </label>
                </div>
              </td>
              <td>{category}</td>
              <td>{currency(amount)}</td>
              <td>{currency(discount)}</td>
              <td>{Privileges[privilege]}</td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
