import { useDispatch, useSelector } from "react-redux";
import {
  SetPackages,
  SetTASK,
} from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import { findReference } from "./../../../../../../../../../services/utilities";

export default function Serology() {
  const { task, params } = useSelector(({ validator }) => validator),
    { collections } = useSelector(({ preferences }) => preferences),
    dispatch = useDispatch();

  const handleChange = (target) => {
    const { name, value } = target;
    dispatch(SetPackages({ ...params, [name]: value }));
    dispatch(
      SetTASK({
        form: task.form,
        task: { ...task, packages: { ...packages, [name]: value } },
      })
    );
  };
  const { packages = {}, key: mapKey, patient } = task;

  return (
    <MDBTable hover responsive className="mb-0">
      <thead>
        <tr>
          <th colSpan={2} className="py-1" />
          <th className="text-center py-1" colSpan={2}>
            Reference
          </th>
        </tr>
        <tr>
          <th className="py-1">Service</th>
          <th className="py-1">Result</th>
          <th className="py-1">Value</th>
          <th className="py-1">Units</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(packages).map(([key, value], index) => {
          const parts = value.split(/[<>]/);
          const result = parts[1] ?? parts[0];
          const service = collections.find((s) => s.id === Number(key)) || {};
          const { preference, abbreviation, name, references } = service;
          const { lo, hi, units, _id } = findReference(
            key,
            patient?.isMale,
            patient?.dob,
            preference,
            references
          );

          return (
            <tr key={`${mapKey}-${index}`}>
              <td className="fw-bold py-1" title={name || abbreviation}>
                {abbreviation || name}
              </td>
              <td className="py-1">
                <input
                  type="text"
                  inputMode="decimal" // shows numeric keyboard with . on mobile
                  pattern="[0-9<>.]*" // allows 0-9, <, >, and .
                  style={{
                    color: result > hi ? "red" : result < lo ? "blue" : "black",
                    // color: referenceColor(
                    //   Number(parts[1]),
                    //   critical,
                    //   alert,
                    //   warn
                    // ),
                  }}
                  name={key}
                  value={String(value)}
                  onChange={(e) => {
                    // ✅ Allow digits, <, >, and only one decimal point
                    const cleaned = e.target.value
                      .replace(/[^0-9<>.]/g, "") // keep only numbers, <, >, and .
                      .replace(/(\..*)\./g, "$1"); // prevent typing more than one decimal point
                    handleChange({ name: key, value: cleaned });
                  }}
                  className="w-100 text-center fw-bold"
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
                    No reference found, please inform the admin first
                  </td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
}
