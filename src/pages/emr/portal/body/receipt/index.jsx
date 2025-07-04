import { QRCodeCanvas } from "qrcode.react";
import {
  billingAddress,
  capitalize,
  currency,
  ENDPOINT,
  mobile,
} from "../../../../../services/utilities";
import { Privileges, Services } from "../../../../../services/fakeDb";
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

const Stub = ({ sale }) => {
  const {
    payment = 0,
    amount = 0,
    cash = 0,
    discount = 0,
    cart = [],
    cashierId: cashier = {},
  } = sale;

  return (
    <div
      style={{
        lineHeight: "20px",
        cursor: "default",
        fontFamily: "Courier New, monospace",
        letterSpacing: "-0.5px",
        fontSize: "20px",
        wordSpacing: "-1px",
      }}
      className="text-center thermal-font"
    >
      <MDBTable responsive borderless className="mb-0 thermal-font">
        <thead>
          <tr>
            <th colSpan={2} className="py-0" style={{ fontSize: "17.5px" }}>
              <h5 className="fw-bold"> Services</h5>
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
          `${cashier?.fullName?.fname?.split?.(" ")[0] || ""} ${
            cashier?.fullName?.lname || ""
          }`
        )}
      />
      <Hr />
    </div>
  );
};

export default function Receipt() {
  const { result: sale } = useSelector(({ portal }) => portal);

  if (!sale || !sale?._id) return <div>Sale is Empty</div>;

  return (
    <div className="mt-3">
      <Stub sale={sale} companyId={sale?.branchId?.companyId?._id} />
    </div>
  );
}
