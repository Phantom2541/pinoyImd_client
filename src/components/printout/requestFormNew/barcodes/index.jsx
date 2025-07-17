import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { Templates } from "../../../../services/fakeDb";
import { capitalize } from "lodash";
import "./style.css";

const BarcodePrintout = ({ forms = {}, sale }) => {
  const { customerId, pn } = sale;
  const refs = useRef({});

  const { fullName = {} } = customerId || {};
  const { fname, lname, mname } = fullName;

  const customerName = `${capitalize(lname)},${capitalize(fname)}${
    mname ? " " + capitalize(mname[0]) + "." : ""
  }`;

  const sanitize = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^ -~]/g, "");

  useEffect(() => {
    if (!forms) return;
    Object.keys(forms).forEach((section) => {
      const svg = refs.current[section];
      if (svg) {
        JsBarcode(
          svg,
          `${Templates.getAbbr(section)}-${sanitize(customerName)}-${String(
            pn
          ).padStart(2, "0")}`,
          {
            format: "CODE128",
            lineColor: "#000",
            width: 2.5, // control line thickness
            height: 100, // close to 30mm
            displayValue: true,
            fontSize: 14,
            margin: 0,
          }
        );
      }
    });
  }, [forms, sale, customerName, pn]);

  return (
    <div className="thermal-print">
      {Object.keys(forms || {}).map((key) => (
        <div key={key} className="barcode-container">
          <svg
            ref={(el) => (refs.current[key] = el)}
            className="result-barcode"
          ></svg>
        </div>
      ))}
    </div>
  );
};

export default BarcodePrintout;
