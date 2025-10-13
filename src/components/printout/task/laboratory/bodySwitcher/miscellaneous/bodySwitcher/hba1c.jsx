import { MDBTable } from "mdbreact";
import { findReference } from "../../../../../../../services/utilities";

export default function Gloucose({ task, fontSize }) {
  const { results, services, patient } = task;

  const service = services.find((s) => s.id === 11) || {};
  const { preference, references } = service;
  const { lo, hi, units } = findReference(
    // warn, alert, critical i remove it for now in desctructuring because the referenceColor is not working
    11,
    patient?.isMale,
    patient?.dob,
    preference,
    references
  );
  const color = results.hba1c < lo ? "blue" : results.hba1c > hi && "red";

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
            <td style={{ color }} className="fw-bold">
              <b>{results.hba1c}</b>
            </td>
            <td>
              {lo} - {hi} {units}
            </td>
          </tr>
        </tbody>
      </MDBTable>
    </div>
  );
}
