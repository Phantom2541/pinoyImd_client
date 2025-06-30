import { MDBCol, MDBRow } from "mdbreact";
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
      {HematologyGroups.map((group, index) => (
        <div key={index} style={{ marginBottom: "5px" }}>
          {group.map((test, subIndex) => (
            <MDBRow key={subIndex}>
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
          {index !== HematologyGroups.length - 1 && (
            <MDBRow>
              <MDBCol md="7">
                <div
                  style={{ borderTop: "1px solid black", marginTop: "5px" }}
                ></div>
              </MDBCol>
            </MDBRow>
          )}
        </div>
      ))}
    </div>
  );
};

export default Hematology;
