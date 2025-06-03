import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";

export default function Collapsable({ item }) {
  const { decSS, frequency } = item;

  return (
    <MDBTable bordered className="m-0 p-0">
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
