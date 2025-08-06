import React from "react";
import { MDBTable } from "mdbreact";

export default function Gloucose({ task, setTask }) {
  const { results = false } = task;

  const handleChange = (value) =>
    setTask({ ...task, results: { ...results, hba1c: value } });

  const getColorClass = (value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "";
    if (num < 4) return "text-primary fw-bold"; // Low → Blue
    if (num > 6) return "text-danger fw-bold"; // High → Red
    return "text-dark fw-bold"; // Normal → Black
  };

  return (
    <>
      <MDBTable hover responsive className="mb-0">
        <thead>
          <tr>
            <th colSpan={2} className="py-1" />
            <th className="text-center py-1" colSpan={2}>
              Service
            </th>
          </tr>
          <tr>
            <th className="py-1">Service</th>
            <th className="py-1">Result</th>
            <th className="py-1">Reference</th>
            <th className="py-1">Units</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fw-bold py-1">GLYCOSYLATED HEMOGLOBIN</td>
            <td className="py-1">
              <input
                type="number"
                name="hb"
                value={results.hba1c || ""}
                onChange={(e) => handleChange(e.target.value)}
                className={`w-100 text-center ${getColorClass(results.hba1c)}`}
              />
            </td>
            <td className="py-1">4 - 6</td>
            <td className="py-1 text-capitalize">%</td>
          </tr>
        </tbody>
      </MDBTable>
    </>
  );
}
