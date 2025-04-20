import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBadge } from "mdbreact";
import { currency, fullName } from "../../../../../../services/utilities";
import { Privileges } from "../../../../../../services/fakeDb";
import { useSelector } from "react-redux";
export default function Collapsable({ deals }) {
  const { vendor } = useSelector(({ deals }) => deals);
  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          {!vendor && <th>Source</th>}
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
            _id,
          } = deal;
          return (
            <tr key={_id}>
              {!vendor && (
                <td>
                  <span className="fw-bold mr-1"> {++index}.</span>
                  {source?.displayname}
                </td>
              )}
              <td>
                {source?._id && (
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
