import React from "react";

const FecalysisData = [
  ["Color", "Consistency", "Mucus"],
  ["Occult Blood", "Fat Globules", "Starch Granules"],
  ["Ova and Parasites", "Cysts", "Trophozoites"],
  ["White Blood Cells", "Red Blood Cells", "Yeast Cells", "Undigested Food"],
];

const Fecalysis = () => {
  return (
    <div style={{ fontSize: "12px", fontFamily: "Helvetica, sans-serif" }}>
      <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Fecalysis</div>
      {FecalysisData.map((group, index) => (
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
          {index !== FecalysisData.length - 1 && (
            <div
              style={{ borderTop: "1px solid black", margin: "5px 0" }}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Fecalysis;
