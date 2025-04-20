import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { currency, dateFormat } from "../../../../../../services/utilities";

export default function Collapsable({ procurement }) {
  const { category, status, accuqired, price, pm, createdAt, descriptions } =
    procurement;
  return (
    <MDBTable bordered>
      <MDBTableHead>
        <tr>
          <th>Categoty</th>
          <th>Date</th>
          <th>accuqired</th>
          <th>Price</th>
          <th>Status</th>
          <th>PM</th>
          <th>Descriptions</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td>
            <h5>{category}</h5>
          </td>
          <td>{dateFormat(createdAt)}</td>
          <td>{accuqired}</td>
          <td>{currency(price)} </td>
          <td>
            <small>{status}</small>
          </td>
          <td>{pm}</td>
          <td>{descriptions}</td>
        </tr>
      </MDBTableBody>
    </MDBTable>
  );
}
