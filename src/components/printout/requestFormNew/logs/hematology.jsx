import React from "react";

const HematologyGroups = [
  ["HCT", "HGB", "RBC", "WBC"],
  ["Segme", "Lympho", "Mono", "Eosi", "Baso", "Stabs"],
  ["Platelet"],
  ["MCV", "MCH", "MCHC", "RDW", "PDW"],
];

const Hematology = () => {
  return (
    <div style={{ fontSize: "12px", fontFamily: "Helvetica, sans-serif" }}>
      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Hematology</div>
      {HematologyGroups.map((group, index) => (
        <div key={index} style={{ marginBottom: "5px" }}>
          {group.map((test, subIndex) => (
            <div
              key={subIndex}
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <span>{test}</span>
              <span
                style={{ borderBottom: "1px dotted black", minWidth: "50px" }}
              ></span>
            </div>
          ))}
          {index !== HematologyGroups.length - 1 && (
            <div
              style={{ borderTop: "1px solid black", marginTop: "5px" }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Hematology;
