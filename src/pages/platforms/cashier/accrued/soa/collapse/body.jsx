import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { currency, fullName } from "../../../../../../services/utilities";
import { Services } from "../../../../../../services/fakeDb";
export default function Collapsable({ deals }) {
  return (
    <MDBTable bordered>
      <MDBTableHead>
        <tr>
          <th>#</th>
          <th>Outsource</th>
          <th>Customer</th>
          <th>Source</th>
          <th>Price</th>
          <th>Services</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {deals?.map((deal, index) => {
          const { customerId, outsource, sendouts, source } = deal;
          return (
            <tr key={index}>
              <td>{++index}</td>
              <td className="fw-bold mb-1">{outsource?.displayname}</td>
              <td className="mb-1">{fullName(customerId?.fullName)}</td>
              <td>{source?.displayname}</td>
              <td className="mb-1">{currency.format(sendouts?.up)}</td>
              <td className="mb-1">
                {sendouts?.servicesId
                  ?.map((id) => Services.getAbbr(id))
                  ?.join(", ")}
              </td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
