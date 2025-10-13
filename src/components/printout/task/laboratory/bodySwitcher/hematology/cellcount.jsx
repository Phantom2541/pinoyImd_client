import { MDBTable } from "mdbreact";
import { Markup } from "interweave";
import { Cellcount as CELLCOUNTS } from "../../../../../../services/fakeDb";
import { calculateIndicators } from "../../../../../../services/utilities";
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
export default function CellCount({ cc, isMale, style, apc, dob }) {
  const devString = preferences.getDevelopmentByBirthDate(dob).name;
  const development =
    Object.entries(devGroups).find(([, arr]) => arr.includes(devString))?.[0] ||
    "neonate";
  const gender = isMale ? "Male" : "Female";

  const { Abbreviation, Title, Si } = CELLCOUNTS;
  const parseValue = (value) =>
    value <= 2 ? value.toFixed(2) : value < 10 ? value.toFixed(1) : value;
  return (
    <MDBTable hover bordered responsive className="mb-0">
      <thead>
        <tr>
          <th className="py-0 fw-bold" style={{ fontSize: "1.2rem" }}>
            Complete Blood Count
          </th>
          <th
            className="py-0 fw-bold text-center"
            style={{ fontSize: "1.2rem", fontWeight: 600 }}
          >
            Results
          </th>
          <th className="py-0 fw-bold" style={{ fontSize: "1.2rem" }}>
            Reference
          </th>
        </tr>
      </thead>
      <tbody>
        {/* CC/Cell Count */}
        {cc.map((cell, index) => {
          const cellRef =
            development === "adult"
              ? Si.cells[Abbreviation[index]][development][gender]
              : Si.cells[Abbreviation[index]][development];

          const { lo, hi, unit } = cellRef || {};

          const color = cell < lo ? "blue" : cell > hi && "red",
            numCell = Number(cell),
            indicators = calculateIndicators(
              cellRef,
              !isNaN(numCell) ? numCell.toFixed(numCell < 20 ? 2 : 0) : ""
            );

          return (
            <tr key={`cell-${index}`}>
              <td style={{ ...style, width: "40%" }} className="py-0  ">
                <span className="ml-2"> {Title[index]}</span>
              </td>
              <td
                style={{
                  ...style,
                  width: "30%",
                  color,
                }}
                className="py-0 fw-bold text-center"
              >
                {numCell.toFixed(cell < 20 ? 2 : 0)}
                {indicators}
              </td>
              <td style={style} className="py-0">
                {parseValue(lo)} - {parseValue(hi)} <Markup content={unit} />
              </td>
            </tr>
          );
        })}
        {cc.length === 0 && (
          <>
            <tr>
              <td style={style} className="py-0">
                <span className="ml-2">Hematocrit</span>
              </td>
              <td
                style={{
                  ...style,
                  color:
                    Si.cells[Abbreviation[0]]?.lo < 150
                      ? "blue"
                      : Si.cells[Abbreviation[0]]?.hi > 450 && "red",
                }}
                className="py-0 fw-bold text-center"
              ></td>
              <td style={style} className="py-0">
                {Si.cells[Abbreviation[0]]?.lo} -{" "}
                {Si.cells[Abbreviation[0]]?.hi}{" "}
                <Markup content={Si.cells[Abbreviation[0]]?.unit} />
              </td>
            </tr>
            <tr>
              <td style={style} className="py-0">
                <span className="ml-2">Hemoglobin</span>
              </td>
              <td
                style={{
                  ...style,
                  color: apc < 150 ? "blue" : apc > 450 && "red",
                }}
                className="py-0 fw-bold text-center"
              ></td>
              <td style={style} className="py-0">
                {Si.cells[Abbreviation[1]]?.lo} -{" "}
                {Si.cells[Abbreviation[1]]?.hi}{" "}
                <Markup content={Si.cells[Abbreviation[1]]?.unit} />
              </td>
            </tr>
            <tr>
              <td style={style} className="py-0">
                <span className="ml-2">Erythrocyte</span>
              </td>
              <td
                style={{
                  ...style,
                  color: apc < 150 ? "blue" : apc > 450 && "red",
                }}
                className="py-0 fw-bold text-center"
              ></td>
              <td style={style} className="py-0">
                {Si.cells[Abbreviation[2]]?.lo} -{" "}
                {Si.cells[Abbreviation[2]]?.hi}{" "}
                <Markup content={Si.cells[Abbreviation[2]]?.unit} />
              </td>
            </tr>
            <tr>
              <td style={style} className="py-0">
                <span className="ml-2">Leukocyte</span>
              </td>
              <td
                style={{
                  ...style,
                  color: apc < 150 ? "blue" : apc > 450 && "red",
                }}
                className="py-0 fw-bold text-center"
              ></td>
              <td style={style} className="py-0">
                {Si.cells[Abbreviation[3]]?.lo} -{" "}
                {Si.cells[Abbreviation[3]]?.hi}{" "}
                <Markup content={Si.cells[Abbreviation[3]]?.unit} />
              </td>
            </tr>
          </>
        )}

        <tr>
          <td style={style} className="py-0">
            <span className="ml-2">APC</span>
          </td>
          <td
            style={{ ...style, color: apc < 150 ? "blue" : apc > 450 && "red" }}
            className="py-0 fw-bold text-center"
          >
            {apc}
          </td>
          <td style={style} className="py-0">
            150 - 450 <sup>9</sup>/L
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
}
