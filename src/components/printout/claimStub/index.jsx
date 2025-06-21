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
      <span>{title}</span>
      <span style={{ fontSize }}>{value}</span>
    </div>
  );
};

const Stub = ({ sale }) => {
  const {
      _id,
      createdAt,
      payment,
      customer,
      privilege,
      amount,
      cash,
      discount,
      cashier,
      cart = [],
    } = sale,
    { fullName, address, email, verified = false } = customer;

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
        value={capitalize(`${fullName.fname} ${fullName.lname}`)}
      />
      {!verified && (
        <Text title="Email" value={email} isAddress fontSize="0.8rem" />
      )}
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
          {cart?.map((menu, index) => {
            const { description, abbreviation, packages = [], up } = menu;

            return (
              <tr key={`menu-${index}`}>
                <td
                  style={{ fontSize: "17.5px" }}
                  className="text-left py-0 px-0 text-uppercase"
                >
                  {description || abbreviation}
                  {packages.length > 1 &&
                    packages.map((id, index) => {
                      console.log("id", id);
                      console.log("here", Services?.find(id));
                      const { name, abbreviation } = Services?.find(id);

                      return (
                        <div
                          key={`package-${index}`}
                          className="ml-4 stub-item"
                        >
                          -{abbreviation || name}
                        </div>
                      );
                    })}
                </td>
                <td
                  style={{ fontSize: "17.5px" }}
                  className="text-right py-0 px-0 fw-bold"
                >
                  {currency(up)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </MDBTable>
      <Hr />
      <Text title="Total" value={currency(amount)} />
      <Text
        title={capitalize(payment)}
        value={payment === "cash" ? currency(cash) : currency(amount)}
      />
      <Text title="Discount" value={currency(discount)} />
      {payment === "cash" && (
        <Text title="Change" value={currency(cash - amount)} />
      )}
      <Hr />
      <Text
        title="Cashier"
        value={capitalize(`${cashier.fname.split(" ")[0]} ${cashier.lname}`)}
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
        THIS SHALL SERVE AS YOUR ACKNOWLEDGEMENT RECEIPT AND IS VALID FORs
        <b> FIVE(5) </b>
        DAYS
      </div>
      <Hr />
      <div className="mt-2">
        <QRCodeCanvas value={`${ENDPOINT}/emr/portal/${_id}`} size={170} />
      </div>
      <h6>Scan this QR Code </h6>
      <h6 style={{ marginTop: "-0.7rem" }}>To check transaction status </h6>
      <Hr />
      <h6 className="font-weight-bold">PINOY-iMD </h6>
      <h6 style={{ marginTop: "-0.3rem" }}>Health within reached </h6>
      <h6 style={{ marginTop: "-0.2rem" }} className="text-nowrap text-left">
        Powered By: <strong>Techonowiz Solution Provider</strong>
      </h6>
      <h6 style={{ marginTop: "-0.4rem" }} className="text-left">
        Contact Number: <strong>{mobile("09350339777")}</strong>
      </h6>
      {/* <img width={75} src={Developer.icon} alt="Developer Icon" /> */}
    </div>
  );
};

export default function ClaimStub() {
  const [sale, setSale] = useState({ _id: "" });

  useEffect(() => {
    setSale(JSON.parse(localStorage.getItem("claimStub")));
  }, []);

  if (sale?._id) return <Stub sale={sale} />;

  return <div>Sale is Empty</div>;
}
