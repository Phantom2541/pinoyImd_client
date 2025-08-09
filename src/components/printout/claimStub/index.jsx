import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  billingAddress,
  capitalize,
  currency,
  ENDPOINT,
  mobile,
} from "../../../services/utilities";
import { Privileges, Services } from "../../../services/fakeDb";
import { MDBTable } from "mdbreact";
import Header from "./header";
import { useSelector } from "react-redux";

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
    } = sale,
    {
      fullName = {},
      address = {},
      email = "",
      verified = false,
    } = customer || {};

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
      {/* {!verified && (
        <Text title="Email" value={email} isAddress fontSize="0.8rem" />
      )} */}
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
      <MDBTable responsive borderless className="mb-0 thermal-font">
        <thead>
          <tr>
            <th colSpan={2} className="py-0" style={{ fontSize: "17.5px" }}>
              Services
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(cart) &&
            cart?.map((menu, index) => {
              const {
                description,
                abbreviation,
                packages = [],
                up,
                discount = 0,
              } = menu;

              return (
                <tr key={`menu-${index}`}>
                  <td
                    style={{ fontSize: "17.5px" }}
                    className="text-left py-0 px-0 text-uppercase"
                  >
                    {description || abbreviation}
                    {Array.isArray(packages) &&
                      packages.length > 1 &&
                      packages.map((id, pIndex) => {
                        const service = Services?.find?.(id);
                        if (!service) return null;

                        const { name, abbreviation } = service;
                        return (
                          <div
                            key={`package-${pIndex}`}
                            className="ml-4 stub-item"
                          >
                            -{abbreviation || name}
                          </div>
                        );
                      })}
                  </td>
                  <td
                    style={{ fontSize: "17.5px" }}
                    className="text-right py-0 px-0"
                  >
                    {currency.format(up + discount)}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </MDBTable>
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
        value={
          payment === "cash" ? currency.format(cash) : currency.format(amount)
        }
      />
      {payment === "cash" && (
        <Text title="Change" value={currency.format(cash - amount)} />
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
      <div className="mt-2">
        I knowingly and voluntarily permit this Health Care Facility to perform
        the above services and agree to pay the specified amount
      </div>
      <div className="mt-2 text-left d-flex">
        Name<div className="w-100 border-bottom border-dark">:</div>
      </div>
      <div className="mt-2 text-left d-flex">
        Relationship<div className="w-100 border-bottom border-dark">:</div>
      </div>
      <br />
      <Hr className="mt-1" />
      <div className="mt-2">
        THIS SHALL SERVE AS YOUR ACKNOWLEDGEMENT RECEIPT AND IS VALID FOR
        <b> FIVE(5) </b>
        DAYS
      </div>
      <Hr />
      <div
        className="my-2"
        style={{
          width: "fit-content",
          height: "185px",
          border: "2px solid black",
          padding: "5px",
          margin: "auto",
        }}
      >
        <QRCodeCanvas
          value={`${ENDPOINT}/emr/portal/${companyId}/${_id}`}
          size={170}
        />
      </div>
      <h6>Scan this QR Code </h6>
      <h6 style={{ marginTop: "-0.7rem" }}>
        To activate your acount and check the transaction status
      </h6>
      <Hr />
      <div className="d-flex align-items-center justify-content-between">
        <h6>Email:</h6>
        <h6 style={{ fontSize: "13px" }}> {email} </h6>
      </div>
      <div className="d-flex align-items-center mt-n2 mb-n2 justify-content-between">
        <h6>Password:</h6>
        <h6 style={{ fontSize: "13px" }}>
          Birthday (format: <span className="fw-bold">YYYYMMDD</span>)
        </h6>
      </div>
      <Hr />
      <h6 className="font-weight-bold">PINOY-iMD </h6>
      <h6 style={{ marginTop: "-0.3rem" }}>Health within reached </h6>
      <h6 style={{ marginTop: "-0.2rem" }} className="text-nowrap text-left">
        Powered By: <strong>Techonowiz Solution Provider</strong>
      </h6>
      <h6 style={{ marginTop: "-0.4rem" }} className="text-left">
        Contact Number: <strong>{mobile("09350339777")}</strong>
      </h6>
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
      // }, 500);
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
