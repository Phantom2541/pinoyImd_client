import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  billingAddress,
  capitalize,
  currency,
} from "../../../services/utilities";
import { Privileges, Services } from "../../../services/fakeDb";
import { MDBTable } from "mdbreact";
import Header from "./header";
import Footer from "./footer";

const Hr = () => (
  <hr
    style={{
      border: "none",
      borderTop: "1px dashed #000",
      height: 0,
    }}
    className="my-1"
  />
);

const Text = ({
  title = "",
  value = "",
  className = "",
  isAddress = false,
}) => {
  return (
    <div className={`d-flex justify-content-between ${className}`}>
      <span>{title}</span>

      <span
        className="fw-bold text-right"
        style={{ fontSize: isAddress && "0.9rem" }}
      >
        {value}
      </span>
    </div>
  );
};

export default function ClaimStub() {
  const { selected } = useSelector(({ deals }) => deals),
    [sale, setSale] = useState(null);

  useEffect(() => {
    setSale(selected);
  }, [selected]);

  if (!sale) return <div>Loading...</div>; // Show loading if sale is not fetched yet

  console.log(sale);

  const {
      _id,
      createdAt,
      payment,
      customer = {},
      privilege,
      amount,
      cash,
      discount,
      cashier = {},
      cart = [],
    } = sale,
    { fullName = {}, address } = customer,
    { fname, lname } = cashier;

  return (
    <div
      style={{
        width: "105mm",
        lineHeight: "20px",
        cursor: "default",
        fontFamily: "Courier New, monospace",
        letterSpacing: "-0.5px",
        fontSize: "20px",
        wordSpacing: "-1px",
      }}
      className="text-center thermal-font claim-stub-printable"
      id="printableArea"
    >
      <Header date={createdAt} dealId={_id} />
      <Text
        className="mt-2"
        title="Name"
        value={capitalize(`${fullName?.fname} ${fullName?.lname}`)}
      />
      <Text title="Address" value={billingAddress(address)} isAddress />
      {privilege !== 0 && (
        <Text title="Privilege" value={Privileges[privilege] || "-"} />
      )}
      <Hr />
      <MDBTable responsive borderless className="mb-0 thermal-font">
        <thead>
          <tr>
            <th colSpan={2} className="py-0" style={{ fontSize: "17.5px" }}>
              ITEMIZED SERVICES BILL
            </th>
          </tr>
        </thead>
        <tbody>
          {cart?.map((menu, index) => {
            const { description, abbreviation, packages = [], srp } = menu;
            console.log("menu", menu);

            return (
              <tr key={`menu-${index}`}>
                <td
                  style={{ fontSize: "17.5px" }}
                  className="text-left py-0 px-0 text-uppercase"
                >
                  {description || abbreviation}
                  {packages.length > 1 &&
                    packages.map((id, index) => {
                      const service = Services.find(id);
                      if (service) {
                        const { name, abbreviation } = service;
                        return (
                          <div
                            key={`package-${index}`}
                            className="ml-4 stub-item"
                          >
                            -{abbreviation || name || ""}
                          </div>
                        );
                      }
                    })}
                </td>
                <td
                  style={{ fontSize: "17.5px" }}
                  className="text-right py-0 px-0 fw-bold"
                >
                  {currency(srp)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </MDBTable>
      <Hr />
      <Text title="SUBTOTAL" value={currency(amount + discount)} />
      <Text title="DISCOUNT :" value={currency(discount)} />
      <Hr />
      <Text title="Total :" value={currency(amount)} />
      <Text
        title="TENDERED AMOUNT :"
        value={payment === "cash" ? currency(cash) : currency(amount)}
      />
      <Text title="PAYMENT METHOD :" value={capitalize(payment)} />
      <Hr />
      {payment === "cash" && (
        <Text title="CHANGE" value={currency(cash - amount)} />
      )}
      <br />
      <Text
        title="CASHIER :"
        value={capitalize(`${fname?.split(" ")[0]} ${lname}`)}
      />
      <Footer />
    </div>
  );
}
