import { MDBTable } from "mdbreact";
import { Cellcount, Diffcount } from "../../../../../../services/fakeDb";
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

export default function DiffCount({ dc, style, dob }) {
  const { Category } = Diffcount,
    { Conventionals } = Cellcount;

  const devString = preferences.getDevelopmentByBirthDate(dob).name;
  const development =
    Object.entries(devGroups).find(([, arr]) => arr.includes(devString))?.[0] ||
    "neonate";

  return (
    <MDBTable hover bordered responsive className="mb-0">
      <thead>
        <tr>
          <th style={{ fontSize: "1.2rem" }} className="py-0 fw-bold">
            Differential Count
          </th>
          <th
            style={{ fontSize: "1.2rem" }}
            className="py-0 fw-bold text-center"
          >
            Results
          </th>
          <th style={{ fontSize: "1.2rem" }} className="py-0 fw-bold">
            Reference
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.values(dc || {}).map((diff, index) => {
          const category = Category[index],
            { lo, hi } = Conventionals.differentials[category][development],
            color = diff < lo ? "blue" : diff > hi && "red";

          return (
            <tr key={`cell-${index}`}>
              <td style={{ ...style, width: "40%" }} className="py-0">
                <span className="ml-2"> {category}</span>
              </td>
              <td
                style={{
                  ...style,
                  width: "30%",
                  color,
                }}
                className="py-0 fw-bold text-center"
              >
                {!!diff && (diff / 100).toFixed(2)}
              </td>
              <td style={style} className="py-0">
                {lo / 100} - {hi / 100}
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
}
