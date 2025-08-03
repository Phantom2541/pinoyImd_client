import { useEffect, useRef } from "react";
import { Barcode } from "../../../../services/utilities";
import JsBarcode from "jsbarcode";

const BarcodePrintout = ({ forms = {}, sale }) => {
  const { customerId, pn } = sale;
  const refs = useRef({});

  useEffect(() => {
    if (!forms) return;
    Object.keys(forms).forEach((section) => {
      const svg = refs.current[section];
      if (svg) {
        try {
          JsBarcode(svg, Barcode.getValue(section, customerId, pn), {
            format: "CODE128",
            lineColor: "#000",
            width: 1.5, //1.5 original
            height: 76,
            displayValue: false,
            fontSize: 20,
            textAlign: "center",
            textPosition: "bottom",
            margin: 12,
          });
        } catch (e) {
          console.error("Barcode render error:", e);
        }
      }
    });
  }, [forms, sale, customerId, pn]);

  useEffect(() => {
    // Inject @page print CSS
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
    @media print {
      @page {
        margin: 0px !important;
        width: 60mm;
        height: 20mm;
        padding: 0px !important;
      }

      html,
      body,
      .laboratory-barcode-container {
        margin: 0 !important;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }

      .laboratory-barcode-container {
        page-break-after: always;
      }

      .laboratory-barcode-container:last-child {
        page-break-after: avoid;
      }

      .laboratory-result-barcode {
        margin-left: -12px;
      }
    }
  `;
    document.head.appendChild(styleTag);

    // Cleanup on unmount
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <div className="laboratory-thermal-print">
      {Object.keys(forms || {}).map((key) => (
        <div key={key} className="laboratory-barcode-container">
          <div style={{ display: "inline-block" }}>
            <svg
              ref={(el) => (refs.current[key] = el)}
              className="laboratory-result-barcode"
              width="100%"
              preserveAspectRatio="xMidYMid meet"
            />
            <small
              style={{
                textAlign: "center",
                fontWeight: 500,
                fontSize: "16px",
                marginTop: "-10px",
                zIndex: 2,
              }}
              className="d-block position-relative"
            >
              {Barcode.getLabel(key, customerId, pn)}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarcodePrintout;
