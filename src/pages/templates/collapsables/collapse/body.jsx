import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";

export default function Collapsable({ service }) {
  const { decSS, frequency } = service;

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
