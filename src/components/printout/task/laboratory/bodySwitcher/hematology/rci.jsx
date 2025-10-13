import { MDBTable } from "mdbreact";
import { Cellcount, Rci as RCI } from "../../../../../../services/fakeDb";
// import { calculateIndicators } from "../../../../../../services/utilities";
import preferences from "./../../../../../../services/fakeDb/diagnostics/references";
const devGroups = {
  adult: [
    "Young Adult",
    "Adult",
    "Middle Aged",
    "Senior",
    "Elderly",
    "Geriatric",
  ],
  child: ["Child", "Pre-Teen", "Teenager"],
  infant: ["Toddler", "Infant"],
  neonate: ["Neonatal", "Fetal"],
};

const options = ["00", "15", "30", "45"];

export default function Rci({ rci = [], style, troupe, dob }) {
  const { Category } = RCI,
    { Si } = Cellcount;
  const devString = preferences.getDevelopmentByBirthDate(dob).name;
  const development =
    Object.entries(devGroups).find(([, arr]) => arr.includes(devString))?.[0] ||
    "neonate";

  const { bt = [], ct = [] } = troupe || {};

  return (
    <MDBTable hover bordered responsive className="mb-0">
      <thead>
        <tr>
          <th className="py-0 fw-bold" style={{ fontSize: "1.2rem" }}>
            Red Cell Immunohaematology
          </th>
          <th
            className="py-0 fw-bold text-center"
            style={{ fontSize: "1.2rem" }}
          >
            Results
          </th>
          <th className="py-0 fw-bold" style={{ fontSize: "1.2rem" }}>
            Reference
          </th>
        </tr>
      </thead>
      <tbody>
        {rci.map((value, index) => {
          const category = Category[index],
            { lo, hi, unit } = Si.rci[category][development],
            color = value < lo ? "blue" : value > hi && "red";

          return (
            <tr key={`cell-${index}-1`}>
              <td style={{ ...style, width: "40%" }} className="py-0">
                <span className="ml-2"> {category} </span>
              </td>
              <td
                style={{
                  ...style,
                  width: "30%",
                  color,
                }}
                className="py-0 fw-bold text-center"
              >
                {value}
              </td>
              <td style={style} className="py-0">
                {lo} - {hi} {unit}
              </td>
            </tr>
          );
        })}
        <tr>
          <td style={style} className="py-0">
            <span className="ml-2"> Bleeding Time</span>
          </td>
          <td style={style} className="py-0 fw-bold">
            {bt[0] && `${troupe?.bt[0]}min :${options[troupe?.bt[1]]} sec.`}
          </td>
          <td style={style} className="py-0">
            2-4 mins
          </td>
        </tr>
        <tr>
          <td style={{ ...style, width: "40%" }} className="py-0">
            <span className="ml-2"> Clotting Time</span>
          </td>
          <td style={{ ...style, width: "30%" }} className="py-0 fw-bold">
            {ct[0] && `${troupe?.ct[0]}min :${options[troupe?.ct[1]]} sec. `}
          </td>
          <td style={style} className="py-0">
            2-4 mins
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0">
            <span className="ml-2"> Reticulocytes</span>
          </td>
          <td style={style} className="py-0 fw-bold text-center">
            {troupe?.retic > 0 && troupe?.retic}
          </td>
          <td style={style} className="py-0">
            0.5-1.5%
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0">
            <span className="ml-2">ESR</span>
          </td>
          <td style={style} className="py-0 fw-bold text-center">
            {troupe?.esr > 0 && troupe?.esr}
          </td>
          <td style={style} className="py-0">
            0-15 mm/hr
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
}
