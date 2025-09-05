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
            <td>GLYCOSYLATED HEMOGLOBIN </td>
            <td>
              <b>{results.hba1c}</b>
            </td>
            <>
              <td>4 - 6 %</td>
            </>
          </tr>
        </tbody>
      </MDBTable>
    </div>
  );
}
