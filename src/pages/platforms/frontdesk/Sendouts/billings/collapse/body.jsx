import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";

export default function Collapsable({ deal }) {
  const { decSS, frequency } = deal;
  console.log("deal", deal);

  return (
    <MDBTable bordered>
      <MDBTableHead>
        <tr>
          <th>Frequency</th>
          <th>Description</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td>
            <h5>{frequency}</h5>
          </td>
          <td>
            <small>{decSS}</small>
          </td>
        </tr>
      </MDBTableBody>
    </MDBTable>
  );
}
