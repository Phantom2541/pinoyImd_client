import React from "react";
import { MDBRow, MDBCol } from "mdbreact";

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
      {UrinalysisData.map((group, index) => (
        <div key={index} style={{ marginBottom: "5px" }}>
          {group.map((test, subindex) => (
            <MDBRow
              key={subindex}
              style={{ display: "flex", alignItems: "center" }}
            >
              <MDBCol md="4">
                <span>{test} </span>
              </MDBCol>
              <MDBCol md="4">
                <span
                  style={{
                    borderBottom: "1px dotted black",
                    display: "block",
                    flexGrow: 1, // Allows it to expand naturally
                    minHeight: "1em", // Ensures consistent height
                  }}
                ></span>
              </MDBCol>
            </MDBRow>
          ))}
          {/* Add a separator except for the last group */}
          {index !== UrinalysisData.length - 1 && (
            <MDBRow>
              <MDBCol md="8">
                <div
                  style={{ borderTop: "1px solid black", margin: "5px 0" }}
                ></div>
              </MDBCol>
            </MDBRow>
          )}
        </div>
      ))}
    </div>
  );
};

export default Urinalysis;
