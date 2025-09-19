import { MDBTable } from "mdbreact";
import { currency } from "../../../services/utilities";
import React from "react";
const Body = ({ cart }) => {
  return (
    <MDBTable responsive borderless className="mb-0 thermal-font">
      <thead>
        <tr>
          <th className="py-1 px-0 text-left" style={{ fontSize: "17.5px" }}>
            Menus
          </th>
          <th className="py-1 text-center" style={{ fontSize: "17.5px" }}>
            Qty
          </th>
          <th className="py-1 text-center" style={{ fontSize: "17.5px" }}>
            SRP
          </th>
          <th className="py-1 text-right px-0 " style={{ fontSize: "17.5px" }}>
            Sub-Total
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(cart) &&
          cart?.map((cart, index) => {
            const { menu, amount, srp, discount = 0, qty = 1 } = cart;
            const { description, abbreviation } = menu;

            return (
              <React.Fragment key={`menu-${index}`}>
                <tr>
                  <td
                    colSpan={4}
                    style={{ fontSize: "17.5px" }}
                    className="text-left py-0  text-uppercase px-0"
                  >
                    {description || abbreviation}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{ fontSize: "17.5px" }}
                    colSpan={4}
                    className=" py-0 px-0 "
                  >
                    <div className="d-flex justify-content-between">
                      <div>*{qty}</div>
                      <div className="text-left"> {currency.format(srp)}</div>
                      <div className="text-right">
                        {currency.format(amount + discount)}
                      </div>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
