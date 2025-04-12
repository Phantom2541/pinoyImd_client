import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBadge } from "mdbreact";
import { currency, fullName } from "../../../../../../services/utilities";
import { Privileges } from "../../../../../../services/fakeDb";
import { useSelector } from "react-redux";
export default function Collapsable({ deals }) {
  const { source } = useSelector(({ deals }) => deals);
  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          {!source._id && <th>Source</th>}
          <th>Customer</th>
          <th>Category</th>
          <th>Services</th>
          <th>Amount</th>
          <th>Discount</th>
          <th>Privilege</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {deals?.map((deal, index) => {
          const {
            customerId,
            category,
            amount,
            discount,
            privilege,
            source,
            cart = [],
          } = deal;
          return (
            <tr key={index}>
              {!source._id && (
                <td>
                  <span className="fw-bold mr-1"> {++index}.</span>
                  {source?.displayname}
                </td>
              )}
              <td>
                {/* <input
                    className="form-check-input m-0 p-0"
                    type="checkbox"
                    id={deal._id}
                    onChange={() => handleSelect(deal)}
                  />
                  <label
                    htmlFor={deal._id}
                    style={{ marginRight: "-0.5rem" }}
                    className="form-check-label label-table"
                  > */}
                {source._id && (
                  <span className="fw-bold mr-1"> {++index}.</span>
                )}
                {fullName(customerId?.fullName)}
              </td>
              <td>{category}</td>
              <td>
                {cart.map(({ menuId }, index) => (
                  <MDBBadge key={index} className="mr-1">
                    {menuId.abbreviation}
                  </MDBBadge>
                ))}
              </td>
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
