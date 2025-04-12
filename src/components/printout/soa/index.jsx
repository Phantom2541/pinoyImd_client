import React, { useEffect, useState } from "react";
import {
  currency,
  fullName,
  getAge,
  getGenderIcon,
} from "../../../services/utilities";
import { Services } from "../../../services/fakeDb";

const SOA = () => {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    const fakeDB = JSON.parse(localStorage.getItem("cluster"));
    setVouchers(fakeDB["652ba7dc55016cf2f1578202"]);
  }, []);

  return (
    <div
      className="mx-1 mt-1"
      style={{
        width: "794px",
        cursor: "default",
        fontFamily: "Helvetica, sans-serif",
        letterSpacing: "-0.5px",
        fontSize: "16px !important",
        borderTop: "1px solid black",
        borderLeft: "1px solid black",
        borderRight: "1px solid black",
      }}
    >
      <div style={{ height: "4rem" }}>
        <div
          className="d-flex align-items-center justify-content-between mt-1 "
          style={{
            borderBottom: "1px solid black",
          }}
        >
          <h6>Source: PANTABANGAN RHU</h6>
          <h6>From: 2021-2022</h6>
        </div>

        <h4 className="fw-bold text-center">Statement Of Account</h4>
      </div>
      {vouchers.map((voucher, index) => (
        <>
          <div
            style={{
              background: "black",
              height: "1.4rem",
            }}
            key={index}
            className="d-flex align-items-center text-white"
          >
            <span className="ml-1">{voucher.date}</span>
            <span className="ml-2">
              (
              {currency(
                voucher?.deals.reduce((sum, deal) => sum + deal.amount, 0)
              )}
              )
            </span>
          </div>
          <table style={{ marginTop: "0rem" }} className="w-100">
            <thead>
              <tr>
                <th className="fw-bold py-2">Customer</th>
                <th className="fw-bold text-center  py-2">Category</th>
                <th className="fw-bold text-center  py-2">Services</th>
                <th className="fw-bold text-center  py-2">Amount</th>
                <th className="fw-bold text-center  py-2">Discount</th>
                <th className="fw-bold text-center  py-2">Privilege</th>
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
                    <td style={{ fontWeight: "bold" }}>
                      {index + 1}.{" "}
                      <strong className="ml-1">
                        {getGenderIcon(customerId?.isMale)}{" "}
                        {fullName(customerId?.fullName)} |{" "}
                        {getAge(customerId?.dob)}
                      </strong>
                    </td>
                    <td className="text-center">{category}</td>
                    <td className="text-left py-0 px-0 text-uppercase">
                      <div className="d-flex align-items-center">
                        {cart?.map(({ menuId }, index) => (
                          <div key={index}>{menuId.abbreviation},</div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </>
      ))}
    </div>
  );
};

export default SOA;
