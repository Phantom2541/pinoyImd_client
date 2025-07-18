import { useEffect, useRef } from "react";
import bwipjs from "bwip-js";
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
      const canvas = refs.current[section];
      if (canvas) {
        try {
          bwipjs.toCanvas(canvas, {
            bcid: "code128", // barcode type
            text: `${Templates.getAbbr(section)}-${sanitize(
              customerName
            )}-${String(pn).padStart(2, "0")}`,
            scale: 3, // scale factor (affects both width & height)
            height: 20, // height in mm (actual printed bar height)
            includetext: true,
            textxalign: "center",
            textsize: 12, // readable font size
          });
        } catch (e) {
          console.error("Barcode render error:", e);
        }
      }
    });
  }, [forms, sale, customerName, pn]);

  return (
    <div className="thermal-print">
      {Object.keys(forms || {}).map((key) => (
        <div key={key} className="barcode-container">
          <canvas
            ref={(el) => (refs.current[key] = el)}
            className="result-barcode"
          />
        </div>
      ))}
    </div>
  );
};

export default BarcodePrintout;
