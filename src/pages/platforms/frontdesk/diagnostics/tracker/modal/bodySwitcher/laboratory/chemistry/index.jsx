import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import {
  referenceColor,
  findReference,
} from "./../../../../../../../../../services/utilities";
import { SetTASK } from "./../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";

export default function Chemistry() {
  const { task } = useSelector(({ validator }) => validator),
    { collections: services } = useSelector(({ preferences }) => preferences),
    dispatch = useDispatch();
  console.log("task", task);

  const { packages = {}, key: mapKey, patient } = task || {};
  const handleChange = (target) => {
    const { name, value } = target,
      _name = Number(name),
      _value = Number(value);

    if (_name !== 16)
      return dispatch(
        SetTASK({
          form: task?.form,
          task: {
            ...task,
            packages: { ...packages, [name]: _value },
          },
        })
      );

    const chole = packages["14"],
      tg = packages["15"],
      ldl = chole - (tg / 5 + _value),
      vldl = tg / 5,
      chr = Number((chole / _value).toFixed(2));

    dispatch(
      SetTASK({
        form: task?.form,
        task: {
          ...task,
          packages: {
            ...packages,
            16: _value,
            17: ldl,
            18: vldl,
            19: chr,
          },
        },
      })
    );
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
          const service = services.find((s) => s.id === Number(key)) || {};
          const { preference, abbreviation, name, references } = service;
          const { lo, hi, warn, alert, critical, units, _id } = findReference(
            Number(key),
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
                  type="number"
                  style={{
                    color: referenceColor(Number(value), critical, alert, warn),
                  }}
                  name={key}
                  value={String(value)}
                  onChange={(e) => handleChange(e.target)}
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
                    No Chemistry reference found, please inform the admin first
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
