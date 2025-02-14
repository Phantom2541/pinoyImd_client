import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import {
  currency,
  fullName,
  getTime,
} from "./../../../../../../../../services/utilities";

export default function SaleTable({ cluster }) {
  return (
    <MDBTable align="middle" hover responsive small className="mt-3">
      <MDBTableHead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Patient</th>
          <th scope="col">Time</th>
          <th scope="col">Category</th>
          <th scope="col">Transaction Id</th>
          <th scope="col">Discounted</th>
          <th scope="col" className="text-center">
            Amount
          </th>
          <th scope="col">Discounted</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {cluster.map((deal, index) => {
          const { customerId, createdAt, category, amount, _id, remarks } =
            deal;
          return (
            <tr
              key={`montly-sale-${index}`}
              style={{ color: amount ? "" : "red" }}
            >
              <td className="fw-bold mb-1">{++index}</td>
              <td className="mb-1">{fullName(customerId?.fullName)}</td>
              <td className="mb-1">{getTime(createdAt)}</td>
              <td className="mb-1">{category}</td>
              <td className="mb-1">{_id}</td>
              <td className="mb-1" />
              <td className="mb-1 text-center">{currency(amount)}</td>
              <td className="mb-1">{remarks}</td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
