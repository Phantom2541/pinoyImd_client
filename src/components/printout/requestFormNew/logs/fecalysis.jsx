import React from "react";
import { MDBRow, MDBCol } from "mdbreact";

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
            <MDBRow key={subindex}>
              <MDBCol md="3">
                <span>{test}</span>
              </MDBCol>
              <MDBCol md="4">
                <span
                  style={{
                    borderBottom: "1px dotted black",
                    display: "inline-block", // Ensures it's treated like a block-level element
                    width: "100%", // Make sure it occupies the available width
                  }}
                ></span>
              </MDBCol>
            </MDBRow>
          ))}
          {/* Add a separator except for the last group */}
          {index !== FecalysisData.length - 1 && (
            <MDBRow>
              <MDBCol md="7">
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

export default Fecalysis;
