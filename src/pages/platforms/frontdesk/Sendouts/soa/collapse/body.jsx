import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";

export default function Collapsable({ soa }) {
  const { hasPaid, status } = soa;

  return (
    <MDBTable bordered>
      <MDBTableHead>
        <tr>
          <th>Status</th>
          <th>Has Paid</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td>
            <h5>{status}</h5>
          </td>
          <td>
            <h5>{hasPaid ? "yes" : "no"}</h5>
          </td>
        </tr>
      </MDBTableBody>
    </MDBTable>
  );
}
