import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import Barcode from "react-barcode";

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
      <span>{title}</span>
      <span style={{ fontSize }}>{value}</span>
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
        value={capitalize(`${fullName.fname || ""} ${fullName.lname || ""}`)}
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
          {Array.isArray(cart) &&
            cart?.map((menu, index) => {
              const { description, abbreviation, packages = [], up } = menu;

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
      <div className="mt-2">
        <QRCodeCanvas
          value={`${ENDPOINT}/emr/portal/${companyId}/${_id}`}
          size={170}
        />
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
    </div>
  );
};

export default function TaskPrintout() {
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
    } catch (error) {
      console.error("Failed to parse claimStub:", error);
    }
  }, []);

  // if (!sale || !sale?._id) return <div>Sale is Empty</div>;

  return (
    <>
      {/* <Stub sale={sale} companyId={companyId?._id} /> */}
      <Barcode
        value="1234567890"
        width={2}
        height={40}
        fontSize={16}
        displayValue={true}
      />
    </>
  );
}

// import React, { useState, useEffect } from "react";
// import Barcode from "react-barcode";
// import Header from "./header";
// import {
//   Chemistry,
//   Hematology,
//   Urinalysis,
//   Miscellaneous,
//   Parasitology,
//   Serology,
// } from "./logs";
// import { MDBCol, MDBRow } from "mdbreact";
// // import { Services } from "../../services/fakeDb";

// const formComponents = {
//   Chemistry,
//   Hematology,
//   Urinalysis,
//   Parasitology,
//   Miscellaneous,
//   Serology,
// };

// const getComponents = (key) => {
//   switch (key) {
//     case "Chemistry":
//     case "Electrolyte":
//     case "Serology":
//       return formComponents["Chemistry"];
//     default:
//       return formComponents[key];
//   }
// };

// const Printout = ({ deal, forms, ssx }) => {
//   const { updatedAt, customerId: customer, referral, category } = deal;

//   return (
//     <div style={{ width: "100vw", height: "100vh", backgroundColor: "white" }}>
//       <div
//         style={{
//           width: "600px",
//           cursor: "default",
//           fontFamily: "Helvetica, sans-serif",
//           letterSpacing: "-0.5px",
//           fontSize: "16px",
//         }}
//       >
//         <Header
//           patient={customer}
//           date={updatedAt}
//           category={category}
//           referral={referral}
//           ssx={ssx}
//         />
//       </div>

//       {/* Updated layout */}

//       <MDBRow>
//         {Object?.keys(forms)?.map((key, index) => {
//           const FormComponent = getComponents(key);
//           return (
//             <MDBCol md="2">
//               <div
//                 key={index}
//                 style={{
//                   height: "100%",
//                   padding: "5px", // Reduce padding
//                   border: "1px solid #ddd", // Light border
//                   borderRadius: "3px", // Smaller border radius
//                   backgroundColor: "#fff",
//                 }}
//               >
//                 <div
//                   style={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     borderBottom: "1px solid #ccc",
//                     paddingBottom: "3px",
//                     marginBottom: "5px",
//                     fontWeight: "bold",
//                     fontSize: "12px", // Smaller font
//                   }}
//                 >
//                   <span>{key}</span>
//                   <span>{forms[key]?.price}</span>
//                 </div>
//                 {FormComponent && (
//                   <div style={{ fontSize: "10px", padding: "2px" }}>
//                     <FormComponent data={forms[key]} />
//                   </div>
//                 )}
//               </div>
//             </MDBCol>
//           );
//         })}
//       </MDBRow>
//       <Barcode
//         value="1234567890"
//         width={2}
//         height={40}
//         fontSize={16}
//         displayValue={true}
//       />
//     </div>
//   );
// };

// export default function TaskPrintout() {
//   const [sale, setSale] = useState(null);
//   const [forms, setForms] = useState(null);
//   const [ssx, setSsx] = useState(null);

//   useEffect(() => {
//     const { forms, deal } = JSON.parse(localStorage.getItem("inhouse"));
//     setSale(deal);
//     setForms(forms);
//     setSsx(localStorage.getItem("ssx") || "");
//   }, []);

//   // Ensure data has been loaded before rendering
//   if (sale === null || forms === null) {
//     return <div>Loading...</div>;
//   }

//   return <Printout deal={sale} forms={forms} ssx={ssx} />;
// }
