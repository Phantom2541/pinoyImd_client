import React from "react";
import { MDBTable } from "mdbreact";

export default function Gloucose({ task, fontSize }) {
  const { results } = task;
  return (
    <div style={{ fontSize: `${fontSize}rem` }}>
      <h3 className="text-center">GLYCOSYLATED HEMOGLOBIN TEST</h3>
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
            <td>GLYCOSYLATED HEMOGLOBIN </td>
            <td>
              <b>{results.hba1c}</b>
            </td>
            <>
              <td className="py-1">4 - 6 %</td>
            </>
          </tr>
        </tbody>
      </MDBTable>
    </div>
  );
}
