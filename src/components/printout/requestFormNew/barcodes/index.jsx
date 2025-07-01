import { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";
import { Templates } from "../../../../services/fakeDb";
import { capitalize } from "lodash";

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
      if (refs.current[section]) {
        JsBarcode(
          refs.current[section],
          `${Templates.getAbbr(section)}-${sanitize(customerName)}-${String(
            pn
          ).padStart(2, "0")}`,
          {
            format: "CODE128",
            lineColor: "#000",
            width: 0.9,
            height: 40,
            displayValue: true,
            fontSize: 16,
            fit: true,
          }
        );
      }
    });
  }, [forms]);

  return (
    <div>
      {Object.keys(forms || {}).map((key) => (
        <div key={key} style={{ marginBottom: "1rem" }}>
          <svg ref={(el) => (refs.current[key] = el)}></svg>
        </div>
      ))}
    </div>
  );
};

export default BarcodePrintout;
