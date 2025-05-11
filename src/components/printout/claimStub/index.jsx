import React, { useEffect, useState } from "react";
import {
  billingAddress,
  capitalize,
  currency,
  useIndexedDB,
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
const printDiv = () => {
  const content = document.getElementById("printableArea").innerHTML;
  const styles = `
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
      .printable-content {
        width: 100%;
        margin: 0 auto;
      }
    </style>
  `;

  const myWindow = window.open("", "", "height=600,width=800");
  myWindow.document.write(`
    <html>
      <head>
        <title>Print</title>
        ${styles}
      </head>
      <body>
        <div class="printable-content">
          ${content}
        </div>
      </body>
    </html>
  `);
  myWindow.document.close();
  myWindow.focus();
  myWindow.print();
  myWindow.close();
};

const Stub = ({ sale = {} }) => {
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
    { fullName, address } = customer;

  return (
    <div className="d-flex justify-content-center mr-5">
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
          value={capitalize(`${fullName.fname} ${fullName.lname}`)}
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
                        const { name, abbreviation } = Services.find(id);

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
        <Footer />
      </div>
      <div className="d-flex justify-content-center ml-2">
        <button onClick={printDiv}>Print</button>
      </div>
    </div>
  );
};

export default function ClaimStub() {
  const [sale, setSale] = useState(null); // Store the sale data in state
  const { getItem } = useIndexedDB();

  useEffect(() => {
    const fetchSaleData = async () => {
      try {
        const saleData = await getItem("claimStub");
        console.log("Fetched sale data:", saleData);
        setSale(saleData); // Store the fetched data in state
      } catch (error) {
        console.error("Error fetching sale data:", error);
      }
    };

    fetchSaleData(); // Call the async function inside useEffect
  }, [getItem]); // Dependency array ensures effect runs on mount

  if (!sale) return <div>Loading...</div>; // Show loading if sale is not fetched yet

  if (sale?._id) return <Stub sale={sale} />; // Render Stub component with sale data

  return <div>Sale is Empty</div>; // Fallback if no sale data is found
}
