import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetPackages, SetTASK } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import { Services } from "./../../../../../../../../../services/fakeDb";
import {
  findReference,
  referenceColor,
} from "./../../../../../../../../../services/utilities";

export default function Serology() {
  const { task, preferences, selected, params } = useSelector(
      ({ validator }) => validator
    ),
    dispatch = useDispatch();

  console.log("params", params);
  const { packages = {}, key: mapKey, patient } = task;
  // const { key: mapKey } = task;
  // const { customerId: patient } = selected;

  const handleChange = (target) => {
    const { name, value } = target;
    console.log("value", value, name);

    dispatch(SetPackages({ ...params, [name]: Number(value) }));
    dispatch(SetTASK({form: task.form, task:{ ...task, packages: { ...packages, [name]: Number(value) } }}));
  };
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
                  onChange={(e)=>handleChange(e.target)}
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
