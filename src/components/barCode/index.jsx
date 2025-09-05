import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const BarCodeGenerator = ({ value = "123456789012", width, height }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      JsBarcode(svgRef.current, value, {
        format: "CODE128",
        displayValue: false,
        lineColor: "#000",
        width: 2,
        height: 50,
      });
    }
  }, [value]);

  return <svg ref={svgRef} style={{ width: width, height: height }}></svg>;
};

export default BarCodeGenerator;
