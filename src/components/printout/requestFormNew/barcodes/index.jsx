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
      .replace(/[^A-Z0-9 \-.$/+%]/gi, "")
      .toUpperCase();

  useEffect(() => {
    if (!forms) return;
    Object.keys(forms).forEach((section) => {
      const svg = refs.current[section];
      if (svg) {
        try {
          JsBarcode(
            svg,
            `${Templates.getAbbr(section)}-${sanitize(customerName)}-${String(
              pn
            ).padStart(2, "0")}`,
            // `d2345678910111212 da`,
            {
              format: "CODE128",
              lineColor: "#000",
              width: 2,
              height: 130,
              displayValue: true,
              fontSize: 40,
              textAlign: "center",
              textPosition: "bottom",
              margin: 12,
            }
          );
        } catch (e) {
          console.error("Barcode render error:", e);
        }
      }
    });
  }, [forms, sale, customerName, pn]);

  return (
    <div className="thermal-print">
      {Object.keys(forms || {}).map((key) => (
        <div key={key} className="barcode-containe ">
          <svg
            ref={(el) => (refs.current[key] = el)}
            className="result-barcode"
            width="100%" // <--- Force it to stretch
            lineColor="#000"
            color="red"
            preserveAspectRatio="xMidYMid meet"
          />
        </div>
      ))}
    </div>
  );
};

export default BarcodePrintout;
