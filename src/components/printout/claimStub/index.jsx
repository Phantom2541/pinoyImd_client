import { useEffect, useState } from "react";
import {
  billingAddress,
  capitalize,
  currency,
} from "../../../services/utilities";
import { Privileges } from "../../../services/fakeDb";
import Header from "./header";
import { useSelector } from "react-redux";
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

const careOfName = (careOf) => {
  const { user = {} } = careOf;
  const { fullName = {} } = user || {};
  return `${fullName.fname} ${fullName?.lname[0]?.toUpperCase()}.`;
};

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

const Stub = ({ sale, companyId }) => {
  const {
      _id,
      createdAt = "",
      payment = 0,
      customer = {},
      privilege,
      amount = 0,
      cash = 0,
      discount = 0,
      cashier = {},
      cart = [],
      refNo = {},
      cardHolder = {},
    } = sale,
    { fullName = {}, address = {}, email = "" } = customer || {};
  const { careOf = {}, pp = "cash" } = refNo || {};
  const isMixed = payment === "mixed";
  const cashOut = amount - refNo?.amount || 0;
  const hasCashOut = cashOut > 0 && isMixed && pp === "cash";

  const isCardHolder = Boolean(
    cardHolder?.company?.name || cardHolder?.company?.ref
  );

  const change = hasCashOut ? cash - cashOut : cash - amount;

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
      <Header date={createdAt} dealId={_id} />
      <Text
        className="mt-2"
        title="Name"
        value={String(
          `${fullName.fname || ""} ${
            String(`${fullName.mname.charAt(0)}. `) || ""
          }  ${fullName.lname || ""}`
        ).toUpperCase()}
      />

      <Text
        title="Address"
        value={billingAddress(address)}
        isAddress
        fontSize="0.9rem"
      />
      {privilege !== 0 && (
        <Text title="Privilege" value={Privileges[privilege] || "-"} />
      )}
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
      {hasCashOut && (
        <>
          <Text title={"Voucher"} value={currency.format(refNo.amount)} />
          <Text title={"Patient Share"} value={currency.format(cashOut)} />
        </>
      )}
      <Text
        title={capitalize(
          payment === "cash" || hasCashOut
            ? "Tendered"
            : payment === "mixed"
            ? "voucher"
            : payment
        )}
        value={
          payment === "cash" || hasCashOut
            ? currency.format(cash)
            : currency.format(refNo.amount)
        }
      />
      {(payment === "cash" || hasCashOut) && change > 0 && (
        <Text title="Change" value={currency.format(change)} />
      )}
      {isMixed && (
        <>
          {isCardHolder && (
            <>
              <Hr />
              <Text
                title={cardHolder.type === "wls" ? "Card No." : "Tracking No."}
                value={`${refNo.number}`}
              />
            </>
          )}
          {careOf?.user?._id && (
            <>
              <Hr />
              <Text
                title="C/O"
                value={`${careOfName(careOf)} (${currency.format(
                  careOf.amount
                )})`}
              />
            </>
          )}
        </>
      )}
      <Hr />
      <Text
        title="Cashier"
        value={capitalize(
          `${cashier?.fname?.split?.(" ")[0] || ""} ${cashier?.lname || ""}`
        )}
      />
      <Hr />
      <br />
      <Footer email={email} companyId={companyId} _id={_id} />
    </div>
  );
};

export default function ClaimStub() {
  const { activePlatform } = useSelector(({ auth }) => auth),
    { branch = {} } = activePlatform,
    { companyId = {} } = branch,
    [sale, setSale] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("claimStub");
      if (raw) {
        const parsed = JSON.parse(raw);
        setSale(parsed);
      }
      // setTimeout(() => {
      //   window.print();
      // }, 2000);
    } catch (error) {
      console.error("Failed to parse claimStub:", error);
    }
  }, []);

  if (!sale || !sale?._id) return <div>Sale is Empty</div>;

  return (
    <>
      <Stub sale={sale} companyId={companyId?._id} />
    </>
  );
}
