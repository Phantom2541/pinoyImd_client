import React from "react";
import { MDBRow, MDBCol, MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import {
  FecalColor,
  Consistency,
  MicroscopicInRange,
} from "../../../../../services/fakeDb";

const Fecalysis = ({ fecalysis }) => {
  const tableRows = [
    ["color", "sg", "ph"],
    ["sugar", "protein", "leucocyte", "nitrate", "bacteria", "blood"],
    ["wbc", "rbc", "ec", "au", "mt", "bact"],
  ].map((item, index) => (
    <tr key={index}>
      <td>{item.join(", ")}</td>
      <td
        style={{
          fontWeight: index === tableRows.length - 1 ? "bold" : "normal",
        }}
      ></td>
    </tr>
  ));

  return (
    <MDBTable>
      <MDBTableHead>
        <tr>
          <th>Urinalysis</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>{tableRows}</MDBTableBody>
    </MDBTable>
  );
};

export default Fecalysis;
