import React from "react";
import { Services } from "./../../../../../../../../../services/fakeDb";
import { MDBTable } from "mdbreact";
import { useSelector } from "react-redux";
import {
  referenceColor,
  findReference,
} from "./../../../../../../../../../services/utilities";

export default function PE({ task, setTask }) {
  const { collections: preferences } = useSelector(
    ({ preferences }) => preferences
  );

  const { packages = {}, key: mapKey, patient } = task;

  const handleChange = (e) => {
    const { name, value } = e.target,
      _name = Number(name),
      _value = Number(value); // HDL input

    if (_name !== 16)
      return setTask({
        ...task,
        packages: { ...packages, [name]: _value },
      });
    // Get values
    const chole = packages["14"], // Total Cholesterol
      tg = packages["15"], // Triglycerides
      hdl = _value; // HDL Cholesterol (input)

    // Compute
    const vldl = tg / 5;
    const ldl = chole - hdl - vldl;
    const chr = Number((chole / hdl).toFixed(2)); // TC/HDL ratio
    const lhr = Number((ldl / hdl).toFixed(2)); // LDL/HDL ratio

    setTask({
      ...task,
      packages: {
        ...packages,
        16: hdl,
        17: ldl,
        18: vldl,
        19: chr,
        20: lhr,
      },
    });
  };

  return (
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
        {Object.entries(packages).map(([key, value], index) => {
          const { preference, abbreviation, name } = Services.find(key),
            { lo, hi, warn, alert, critical, units, _id } = findReference(
              key,
              patient?.isMale,
              patient?.dob,
              preference,
              preferences
            );

          return (
            <tr key={`${mapKey}-${index}`}>
              <td className="fw-bold py-1" title={name || abbreviation}>
                {abbreviation || name}
              </td>
              <td className="py-1">
                <input
                  type="number"
                  style={{
                    color: referenceColor(Number(value), critical, alert, warn),
                  }}
                  name={key}
                  value={String(value)}
                  onChange={handleChange}
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
