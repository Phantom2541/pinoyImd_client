import React from "react";
import {
  currency,
  fullName,
  getAge,
  getGenderIcon,
} from "../../../services/utilities";
import { Privileges } from "../../../services/fakeDb";

const Body = ({ vouchers }) => {
  return (
    <>
      {vouchers.map((voucher, index) => (
        <>
          <div
            style={{
              // background: "rgb(200, 196, 196)",
              background: "rgba(46,110,172,255)",
              height: "1.4rem",
            }}
            key={index}
            className="d-flex align-items-center text-white"
          >
            <span className="ml-1">{voucher.date}</span>
            <span className="ml-2">
              (
              {
                (currency,
                format(
                  voucher?.deals.reduce((sum, deal) => sum + deal.amount, 0)
                ))
              }
              )
            </span>
          </div>
          <table style={{ marginTop: "0rem" }} className="w-100">
            <thead>
              <tr>
                <th className="fw-bold ">Customer</th>
                <th className="fw-bold text-center  ">Category</th>
                <th className="fw-bold  ">Services</th>
                <th className="fw-bold  ">Amount</th>
                <th className="fw-bold  ">Discount</th>
                <th className="fw-bold text-center  ">Privilege</th>
              </tr>
            </thead>
            <tbody>
              {voucher.deals?.map(
                (
                  {
                    customerId,
                    category,
                    amount,
                    discount,
                    privilege,
                    cart = [],
                  },
                  index
                ) => (
                  <tr
                    style={{
                      borderBottom: "1px solid black",
                      borderTop: "1px solid black",
                    }}
                    key={index}
                  >
                    <td style={{ fontWeight: "bold", width: "40%" }}>
                      {index + 1}.{" "}
                      <strong className="ml-1">
                        {getGenderIcon(customerId?.isMale)}{" "}
                        {fullName(customerId?.fullName)} |{" "}
                        {getAge(customerId?.dob)}
                      </strong>
                    </td>
                    <td className="text-center " style={{ width: "10%" }}>
                      {category}
                    </td>
                    <td
                      className="text-left py-0 px-0 text-uppercase "
                      style={{ width: "13%" }}
                    >
                      <div className="d-flex align-items-center">
                        {cart?.map(({ menuId }, index) => (
                          <div key={index}>{menuId.abbreviation},</div>
                        ))}
                      </div>
                    </td>
                    <td style={{ width: "12%" }}>{currency.format(amount)}</td>
                    <td style={{ width: "10%" }}>
                      {currency.format(discount)}
                    </td>
                    <td className="text-center">{Privileges[privilege]}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </>
      ))}
    </>
  );
};

export default Body;
