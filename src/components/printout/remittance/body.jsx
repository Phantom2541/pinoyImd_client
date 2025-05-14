import React, { useState, useEffect } from "react";
import { MDBBadge, MDBTable } from "mdbreact";
import { currency, fullName } from "../../../services/utilities";
import { Services } from "../../../services/fakeDb";

const Body = () => {
  const [remittance, setRemittance] = useState([]);

  useEffect(() => {
    setRemittance(JSON.parse(localStorage.getItem("resecos")));
  }, []);

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Denomination</th>
          <th>Qnty</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {remittance?.map((item, index) => {
          const { deals, date } = item;
          const _deals = deals.map((deal, i) => {
            const { customerId, amount, cart, physicianId } = deal;
            return (
              <tr key={index}>
                <td key={index}>{i + 1}</td>
                <td>{fullName(customerId?.fullName)}</td>
                <td>
                  {cart.map(({ packages }) =>
                    packages.map((id) => (
                      <MDBBadge key={id} className="mr-1" color="primary">
                        {Services.getAbbr(id)}
                      </MDBBadge>
                    ))
                  )}
                </td>
                <td>{currency(amount)}</td>
                <td>{fullName(physicianId?.fullName)}</td>
              </tr>
            );
          });
          return (
            <>
              <tr>
                <td colSpan={4}>{date}</td>
              </tr>
              {_deals}
            </>
          );
        })}
        <tr>
          <td colSpan={3}>Total</td>
          <td colSpan={2}>
            <h4>
              {currency(
                remittance
                  ?.flatMap(({ deals }) => deals.map((item) => item.amount))
                  .reduce((acc, item) => acc + item, 0)
              )}
            </h4>
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
};

export default Body;
