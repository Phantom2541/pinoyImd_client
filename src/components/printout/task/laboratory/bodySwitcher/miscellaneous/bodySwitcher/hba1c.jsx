import React from "react";
import { MDBTable } from "mdbreact";

export default function Gloucose({ task, fontSize }) {
  const { results } = task;

  const getColorClass = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    if (num < 4) return "text-primary fw-bold"; // Low = blue
    if (num > 6) return "text-danger fw-bold"; // High = red
    return "text-dark fw-bold"; // Normal = black
  };

  return (
    <div style={{ fontSize: `${fontSize}rem` }}>
      <h3 className="text-center">GLYCOSYLATED HEMOGLOBIN TEST</h3>
      <MDBTable
        hover
        striped
        bordered
        responsive
        small
        className="mb-0 text-center no-side-border-table"
      >
        <thead>
          <tr>
            <th>Services</th>
            <th>Result</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>GLYCOSYLATED HEMOGLOBIN</td>
            <td className={getColorClass(results.hba1c)}>
              <b>{results.hba1c}</b>
            </td>
            <td>4 - 6 %</td>
          </tr>
        </tbody>
      </MDBTable>
    </div>
  );
}
