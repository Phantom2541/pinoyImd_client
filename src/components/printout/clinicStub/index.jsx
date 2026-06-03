import { useEffect, useState } from "react";
import {
  billingAddress,
  capitalize,
  currency,
} from "../../../services/utilities";
// import { Privileges } from "../../../services/fakeDb";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";

const Hr = ({ className = "" }) => (
  <hr
    style={{
      border: "none",
      borderTop: "1px dashed #000",
      height: 0,
    }}
    className={`my-1 ${className}`}
  />
);

const Text = ({ title = "", value = "", className = "", fontSize = "" }) => {
  return (
    <div className={`d-flex justify-content-between ${className}`}>
      <span className="mr-2">{title}:</span>
      <span
        style={{
          fontSize,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "inline-block",
          maxWidth: "100%", // or any fixed width like '200px'
        }}
      >
        {value}
      </span>
    </div>
  );
};

const Stub = ({ sale }) => {
  const {
      _id,
      createdAt = "",
      payment = 0,
      patient: customer = {},
      amount = 0,
      cash = 0,
      discount = 0,
      userId: cashier = {},
      cart = [],
      appointment = {},
    } = sale,
    { fullName = {}, address = {}, email = "" } = customer || {};

  const change = cash - amount;

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
      className="text-center thermal-font"
    >
      <Header date={createdAt} dealId={_id} appointment={appointment} />
      <Text
        className="mt-2"
        title="Name"
        value={String(
          `${fullName.fname || ""} ${
            String(`${fullName.mname.charAt(0)}. `) || ""
          }  ${fullName.lname || ""}`,
        ).toUpperCase()}
      />

      <Text
        title="Address"
        value={billingAddress(address)}
        isAddress
        fontSize="0.9rem"
      />

      <Hr />
      <Body cart={cart} />
      <Hr />
      <Text
        title="Total"
        value={currency.format(amount + discount)}
        className="fw-bold"
      />
      {discount > 0 && (
        <>
          <Text title="Discount" value={currency.format(discount)} />
          <Text
            title="Subtotal"
            value={currency.format(amount)}
            className="fw-bold"
          />
        </>
      )}
      <Hr />

      <Text
        title={capitalize(payment === "cash" ? "Tendered" : payment)}
        value={payment === "cash" ? currency.format(cash) : ""}
      />
      {payment === "cash" && change > 0 && (
        <Text title="Change" value={currency.format(change)} />
      )}

      <Hr />
      <Text
        title="Cashier"
        value={capitalize(
          `${cashier?.fullName?.fname?.split?.(" ")[0] || ""} ${
            cashier?.fullName?.lname || ""
          }`,
        )}
      />
      <Hr />
      <br />
      <Footer email={email} _id={_id} />
    </div>
  );
};

export default function ClinicStub() {
  const [sale, setSale] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("clinicStub");
      if (raw) {
        const parsed = JSON.parse(raw);
        setSale(parsed);
      }
      setTimeout(() => {
        window.print();
      }, 500);
    } catch (error) {
      console.error("Failed to parse claimStub:", error);
    }
  }, []);

  if (!sale || !sale?._id) return <div>Sale is Empty</div>;

  return (
    <>
      <Stub sale={sale} />
    </>
  );
}
