import React from "react";
import { MDBCol, MDBTable, MDBTableBody } from "mdbreact";

export default function Ogtt({ task, fontSize }) {
  const { results, packages } = task;
  return (
    <div style={{ fontSize: `${fontSize}rem` }}>
      <h3 className="text-center">ORAL GLOUCOSE TOLERANCE TEST</h3>
      <MDBTable
        hover
        striped
        bordered
        responsive
        small
        className="mb-0 text-center"
      >
        <thead>
          <tr>
            <th>Service</th>
            <th>Result</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fasting Blood Sugar </td>
            <td>
              <b>{results.fbs}</b>
            </td>
            <td>70-110 mg/dL</td>
          </tr>
          <tr>
            <td>1st Hour</td>
            <td>
              <b>{results.fhr}</b>
            </td>
            <td>up to 180 mg/dL</td>
          </tr>
          <tr>
            <td>2nd Hour</td>
            <td>
              <b>{results.shr}</b>
            </td>
            <td>up to 153 mg/dL</td>
          </tr>
        </tbody>
      </MDBTable>
    </div>
  );
}
