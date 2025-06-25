import React from "react";
import { useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import { currency } from "../../../services/utilities";

const Body = () => {
  const { closing, sales } = useSelector(
    ({ remittances }) => remittances.selected
  );
  const { coins = {}, bills = {} } = closing || {};

  let rowIndex = 1;

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th style={{ textAlign: "center" }}>#</th>
          <th style={{ textAlign: "center" }}>Denomination</th>
          <th style={{ textAlign: "center" }}>Qnty</th>
          <th style={{ textAlign: "center" }}>Amount</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(coins).map(([denomination, quantity]) => {
          const amount = denomination * quantity;
          return (
            <tr key={`coin-${denomination}`}>
              <td>{rowIndex++}</td>
              <td>{currency(denomination)}</td>
              <td>{quantity}</td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>
                {currency(amount)}
              </td>
            </tr>
          );
        })}
        {Object.entries(bills).map(([denomination, quantity]) => {
          const amount = denomination * quantity;
          return (
            <tr key={`bill-${denomination}`}>
              <td>{rowIndex++}</td>
              <td>{currency(denomination)}</td>
              <td>{quantity}</td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>
                {currency(amount)}
              </td>
            </tr>
          );
        })}
        <tr>
          <td style={{ textAlign: "right" }} colSpan={3}>
            Total Remit :
          </td>
          <td style={{ textAlign: "right", fontWeight: "bold" }}>
            <h4>{currency(sales)}</h4>
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
};

export default Body;
