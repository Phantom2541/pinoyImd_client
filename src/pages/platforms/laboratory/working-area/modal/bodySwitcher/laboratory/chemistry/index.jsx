import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import {
  // referenceColor,
  findReference,
} from "./../../../../../../../../services/utilities";
import { SetTASK } from "./../../../../../../../../services/redux/slices/diagnostics/laboratory/validator.js";
export default function Chemistry() {
  const { task } = useSelector(({ validator }) => validator),
    { collections: services } = useSelector(({ preferences }) => preferences),
    dispatch = useDispatch();
  const { packages = {}, key: mapKey, patient } = task || {};
  const inputRefs = useRef([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      const first = inputRefs.current[0];
      if (first && first.offsetParent !== null) {
        first.focus();
      }
    }, 1000); // try 1s delay temporarily

    return () => clearTimeout(timer);
  }, [mapKey]);

  const handleChange = (target) => {
    const { name, value } = target,
      _name = Number(name);
    let _value = value;

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

    // Get values
    const chole = packages["14"], // Total Cholesterol
      tg = packages["15"], // Triglycerides
      hdl = Number(_value); // HDL Cholesterol (input)

    // Compute
    const vldl = tg / 5;
    const ldl = chole - hdl - vldl;
    const lhr = Number((ldl / hdl).toFixed(2)); // LDL/HDL ratio
    const chr = Number((chole / hdl).toFixed(2)); // TC/HDL ratio

    dispatch(
      SetTASK({
        form: task?.form,
        task: {
          ...task,
          packages: {
            ...packages,
            16: hdl,
            17: ldl.toFixed(1),
            18: vldl.toFixed(1),
            19: chr,
            47: lhr,
          },
        },
      })
    );
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = inputRefs.current[index + 1];
      if (next) next.focus();
    }
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
          const { lo, hi, units, _id } = findReference(
            // warn, alert, critical i remove it for now in desctructuring because the referenceColor is not working
            Number(key),
            patient?.isMale,
            patient?.dob,
            preference,
            references
          );
          const color = value < lo ? "blue" : value > hi && "red";

          return (
            <tr key={`${mapKey}-${index}`}>
              <td className="fw-bold py-1" title={name || abbreviation}>
                {abbreviation || name}
              </td>
              <td className="py-1">
                <input
                  type="number"
                  step="any" // ✅ allow decimals
                  ref={(el) => (inputRefs.current[index] = el)}
                  style={{
                    // color: referenceColor(Number(value), critical, alert, warn),
                    color,
                  }}
                  name={key}
                  value={String(value)}
                  onChange={(e) => handleChange(e.target)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
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
