import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";

const Chemistry = () => {
  return (
    <MDBTable className="mt-3">
      <MDBTableHead>
        <tr>
          <th>Test</th>
          <th>Result</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td>Blood Urea Nitrogen (BUN)</td>
          <td></td>
        </tr>
        <tr>
          <td>Creatinine</td>
          <td></td>
        </tr>
        <tr>
          <td>Glucose</td>
          <td></td>
        </tr>
        <tr>
          <td>Cholesterol</td>
          <td></td>
        </tr>
        <tr>
          <td>Triglycerides</td>
          <td></td>
        </tr>
        <tr>
          <td>HDL</td>
          <td></td>
        </tr>
        <tr>
          <td>LDL</td>
          <td></td>
        </tr>
        <tr>
          <td>Uric Acid</td>
          <td></td>
        </tr>
        <tr>
          <td>SGOT (AST)</td>
          <td></td>
        </tr>
        <tr>
          <td>SGPT (ALT)</td>
          <td></td>
        </tr>
        <tr>
          <td>Albumin</td>
          <td></td>
        </tr>
        <tr>
          <td>Globulin</td>
          <td></td>
        </tr>
        <tr>
          <td>A/G Ratio</td>
          <td></td>
        </tr>
      </MDBTableBody>
    </MDBTable>
  );
};

export default Chemistry;
