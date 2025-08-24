import { MDBTable } from "mdbreact";

export default function Gloucose({ task, fontSize }) {
  const { results } = task;

  // color logic for HbA1c
  const getColorClass = (value, lo = 4, hi = 6) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "text-dark fw-bold";
    if (num < lo) return "text-primary fw-bold"; // Low = Blue
    if (num > hi) return "text-danger fw-bold"; // High = Red
    return "text-dark fw-bold"; // Normal = Black
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
