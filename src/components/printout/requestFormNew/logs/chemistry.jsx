import React from "react";

const ChemistryTests = [
  "Blood Urea Nitrogen (BUN)",
  "Creatinine",
  "Glucose",
  "Cholesterol",
  "Triglycerides",
  "HDL",
  "LDL",
  "Uric Acid",
  "SGOT (AST)",
  "SGPT (ALT)",
  "Albumin",
  "Globulin",
  "A/G Ratio",
];

const Chemistry = () => {
  return (
    <div style={{ fontSize: "12px", fontFamily: "Helvetica, sans-serif" }}>
      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Chemistry</div>
      {ChemistryTests.map((test, index) => (
        <div
          key={index}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>{test}</span>
          <span
            style={{ borderBottom: "1px dotted black", minWidth: "50px" }}
          ></span>
        </div>
      ))}
    </div>
  );
};

export default Chemistry;
