import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBadge } from "mdbreact";
import {
  currency,
  fullName,
  getAge,
  getGenderIcon,
} from "../../../../../../services/utilities";
import { Categories, Privileges } from "../../../../../../services/fakeDb";
import { useSelector } from "react-redux";
export default function Collapsable({ deals }) {
  const { vendor } = useSelector(({ deals }) => deals);
  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          {!vendor?._id && <th>Source</th>}
          <th>Customer</th>
          <th>Category</th>
          <th>Services</th>
          <th>Amount</th>
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
              {!vendor?._id && (
                <td>
                  <span className="fw-bold mr-1"> {++index}.</span>
                  {source?.abbr || source?.displayname}
                </td>
              )}
              <td>
                <h6>
                  {source?._id && (
                    <span className="fw-bold mr-1">
                      {!!vendor && `${++index}.`}
                    </span>
                  )}
                  {fullName(customerId?.fullName)}
                </h6>
                <small>
                  {getGenderIcon(customerId?.isMale)} {getAge(customerId?.dob)}
                </small>
              </td>
              <td>
                <h5
                  title={Categories.find(({ abbr }) => abbr === category)?.name}
                >
                  {category}
                </h5>
                {privilege > 0 && <small>{Privileges[privilege]}</small>}
              </td>
              <td>
                {cart.map(({ menuId }, index) => (
                  <MDBBadge key={index} className="mr-1">
                    {menuId.abbreviation}
                  </MDBBadge>
                ))}
              </td>
              <td>
                <h6>{currency.format(amount)}</h6>
                {!!discount && (
                  <MDBBadge className="mr-1 danger" title="Discount" tag="span">
                    {currency.format(discount)}
                  </MDBBadge>
                )}
              </td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
