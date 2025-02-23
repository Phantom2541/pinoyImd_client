import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";

const Attri = [
  ["hct", "hgb", "rbc", "wbc"],
  [
    "segme", //   neutrophils
    "lympo",
    "mono",
    "eosi",
    "baso",
    "stabs",
  ],
  ["platelet"],
  ["mcv", "mch", "mchc", "rdw", "pdw"],
];
const Hematology = () => {
  return (
    <MDBTable>
      <MDBTableHead>
        <tr>
          <th>Hematology</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {Attri.map((item, index) => (
          <React.Fragment key={item}>
            {item.map((subitem, subindex) => (
              <tr key={subitem}>
                <td>{subitem}</td>
                <td></td>
              </tr>
            ))}
            {index !== Attri.length - 1 && (
              <tr style={{ border: "1px solid black", fontWeight: "bold" }} />
            )}
          </React.Fragment>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
};

export default Hematology;
