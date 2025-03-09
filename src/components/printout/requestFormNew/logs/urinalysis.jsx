import React from "react";

const UrinalysisData = [
  ["Color", "SG", "pH"],
  ["Sugar", "Protein", "Leucocyte", "Nitrate", "Bacteria", "Blood"],
  [
    "WBC",
    "RBC",
    "Epithelial Cells",
    "Amorphous Urates",
    "Mucus Threads",
    "Bacteria",
  ],
];

const Urinalysis = () => {
  return (
    <div style={{ fontSize: "12px", fontFamily: "Helvetica, sans-serif" }}>
      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Urinalysis</div>
      {UrinalysisData.map((group, index) => (
        <div key={index} style={{ marginBottom: "5px" }}>
          {group.map((test, subindex) => (
            <div
              key={subindex}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>{test}</span>
              <span
                style={{ borderBottom: "1px dotted black", minWidth: "50px" }}
              ></span>
            </div>
          ))}
          {/* Add a separator except for the last group */}
          {index !== UrinalysisData.length - 1 && (
            <div
              style={{ borderTop: "1px solid black", margin: "5px 0" }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Urinalysis;
