import { MDBTable } from "mdbreact";
import { useSelector } from "react-redux";
import { findReference } from "../../../../../../../../../services/utilities";

export default function Gloucose({ task, setTask }) {
  const { results = false, patient } = task,
    { collections: services } = useSelector(({ preferences }) => preferences);

  const handleChange = (value) =>
    setTask({ ...task, results: { ...results, hba1c: value } });

  const service = services.find((s) => s.id === Number(11)) || {};
  const { preference, references } = service;
  const { lo, hi, units, _id } = findReference(
    // warn, alert, critical i remove it for now in desctructuring because the referenceColor is not working
    11,
    patient?.isMale,
    patient?.dob,
    preference,
    references
  );
  const color = results.hba1c < lo ? "blue" : results.hba1c > hi && "red";

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
                style={{
                  color,
                }}
                name="hb"
                value={results.hba1c || ""}
                onChange={(e) => handleChange(e.target.value)}
                className={`w-100 text-center fw-bold`}
              />
            </td>
            {_id ? (
              <>
                <td className="py-1">{!lo ? `< ${hi}` : `${lo} - ${hi}`}</td>
                <td className="py-1 text-capitalize">{units}</td>
              </>
            ) : (
              <>
                <td colSpan={2} className="py-1">
                  No Miscellaneous reference found, please inform the admin
                  first
                </td>
              </>
            )}
          </tr>
        </tbody>
      </MDBTable>
    </>
  );
}
