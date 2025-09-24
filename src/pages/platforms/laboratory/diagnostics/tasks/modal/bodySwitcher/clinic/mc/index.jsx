import { Services } from "./../../../../../../../../../services/fakeDb";
import { MDBTable } from "mdbreact";
import { useSelector } from "react-redux";
import {
  referenceColor,
  findReference,
} from "./../../../../../../../../../services/utilities";

export default function Chemistry({ task, setTask }) {
  const { collections: preferences } = useSelector(
    ({ preferences }) => preferences
  );

  const { packages = {}, key: mapKey, patient } = task;

  const handleChange = (e) => {
    const { name, value } = e.target,
      _name = Number(name),
      _value = Number(value);

    // Default: just update the value
    let updatedPackages = { ...packages, [name]: _value };

    // --- Lipid panel ---
    if (_name === 16) {
      // HDL input triggers lipid calculations
      const chole = packages["14"]; // Total Cholesterol
      const tg = packages["15"]; // Triglycerides
      const hdl = Number(_value.toFixed(1));

      const vldl = tg / 5;
      const ldl = chole - hdl - vldl;
      const lhr = Number((ldl / hdl).toFixed(2));
      const chr = Number((chole / hdl).toFixed(2));

      updatedPackages = {
        ...updatedPackages,
        16: _value,
        17: ldl.toFixed(1), // LDL
        18: vldl.toFixed(1), // VLDL
        19: chr, // TC/HDL ratio
        47: lhr, // LDL/HDL ratio
      };
    }
    // --- Bilirubin ---
    if (_name === 33) {
      // 34 = indirect, 33 = direct, total = 32
      const total = packages["32"] ?? 0;
      const direct = packages["33"] ?? 0;
      updatedPackages["34"] = Number((total - direct).toFixed(2));
    }
    // --- Total Protein ---
    if (_name === 38) {
      // 36 = albumin, 37 = globulin, total = 35
      const albumin = packages["36"] ?? 0;
      const globulin = packages["37"] ?? 0;
      updatedPackages["35"] = Number((albumin + globulin).toFixed(2));
    }
    // TPAG // Albumin[36] : Globulin[37] Ratio
    if (_name === 37) {
      const albumin = packages["36"] ?? 0;
      const globulin = packages["37"] ?? 0;
      updatedPackages["38"] = globulin
        ? Number((albumin / globulin).toFixed(2))
        : 0;
    }
    // 396 // Urine Albumin[358] : Creatinine[20] Ratio
    if (_name === 358) {
      const albumin = packages["358"] ?? 0;
      const creatinine = packages["20"] ?? 0;
      updatedPackages["396"] = creatinine
        ? Number((albumin / creatinine).toFixed(2))
        : 0;
    }
    // 397 // Urine Protein[359] : Creatinine[20] Ratio
    if (_name === 359) {
      const protein = packages["359"] ?? 0; // Urine Protein
      const creatinine = packages["20"] ?? 0; // Creatinine
      updatedPackages["397"] = creatinine
        ? Number((protein / creatinine).toFixed(2))
        : 0;
    }
    // 398 // Urine Microalbumin[360] : Creatinine[20] Ratio
    if (_name === 415) {
      const microalbumin = packages["415"] ?? 0; // Urine Microalbumin
      const creatinine = packages["20"] ?? 0; // Creatinine
      updatedPackages["398"] = creatinine
        ? Number((microalbumin / creatinine).toFixed(2))
        : 0;
    }

    setTask({
      ...task,
      packages: updatedPackages,
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
