import { MDBTable } from "mdbreact";
import { Markup } from "interweave";
import { Cellcount } from "../../../../../../services/fakeDb";
import { calculateIndicators } from "../../../../../../services/utilities";
export default function CellCount({ cc, isMale, style, apc }) {
  const { Preferences, Abbreviation, Title } = Cellcount;

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
          const _cell = Number(cell),
            reference = Preferences[isMale],
            { lo, hi, unit } = reference[Abbreviation[index]],
            color = _cell < lo ? "blue" : _cell > hi && "red",
            indicators = calculateIndicators(
              reference.hct,
              _cell.toFixed(_cell < 20 ? 2 : 0)
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
                {_cell.toFixed(_cell < 20 ? 2 : 0)}
                {indicators}
              </td>
              <td style={style} className="py-0">
                {parseValue(lo)} - {parseValue(hi)} <Markup content={unit} />
              </td>
            </tr>
          );
        })}

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
