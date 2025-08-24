import { MDBTable } from "mdbreact";

export default function Ogtt({ task, fontSize }) {
  const { results } = task;

  // helper to check result against reference
  const getResultColor = (value, lo, hi, type = "range") => {
    if (type === "range") {
      if (value < lo) return "blue"; // low
      if (value > hi) return "red"; // high
      return "black"; // normal
    }
    if (type === "max") {
      if (value > hi) return "red"; // above max
      return "black"; // normal
    }
  };

  return (
    <div style={{ fontSize: `${fontSize}rem` }}>
      <h3 className="text-center">ORAL GLUCOSE TOLERANCE TEST</h3>
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
            <th>Service</th>
            <th>Result</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fasting Blood Sugar</td>
            <td
              style={{ color: getResultColor(results.fbs, 70, 110, "range") }}
            >
              <b>{results.fbs}</b>
            </td>
            <td>70 - 110 mg/dL</td>
          </tr>
          <tr>
            <td>1st Hour</td>
            <td
              style={{ color: getResultColor(results.fhr, null, 180, "max") }}
            >
              <b>{results.fhr}</b>
            </td>
            <td>up to 180 mg/dL</td>
          </tr>
          <tr>
            <td>2nd Hour</td>
            <td
              style={{ color: getResultColor(results.shr, null, 153, "max") }}
            >
              <b>{results.shr}</b>
            </td>
            <td>up to 153 mg/dL</td>
          </tr>
        </tbody>
      </MDBTable>
    </div>
  );
}
