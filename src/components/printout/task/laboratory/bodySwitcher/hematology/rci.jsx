import React from "react";
import { MDBTable } from "mdbreact";
import { Cellcount, Rci as RCI } from "../../../../../../services/fakeDb";
// import { calculateIndicators } from "../../../../../../services/utilities";

const options = ["00", "15", "30", "45"];

export default function Rci({ rci = [], style, troupe, ct = [], bt = [] }) {
  const { Category } = RCI,
    { Preferences } = Cellcount;

  return (
    <MDBTable hover bordered responsive className="mb-0">
      <thead>
        <tr>
          <th className="py-0" />
          <th style={style} className="py-0">
            Results
          </th>
          <th style={style} className="py-0">
            Reference
          </th>
        </tr>
      </thead>
      <tbody>
        {rci.map((value, index) => {
          const category = Category[index],
            reference = Preferences.rci[category],
            { lo, hi, unit } = reference,
            color = value < lo ? "blue" : value > hi && "red";
          // indicators = calculateIndicators(
          //   reference.hct,
          //   value.toFixed(value < 20 ? 2 : 0)
          // );

          return (
            <tr key={`cell-${index}`}>
              <td style={style} className="py-0">
                {category}
              </td>
              <td
                style={{
                  ...style,
                  color,
                }}
                className="py-0 fw-bold"
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
            Bleeding Time
          </td>
          <td style={style} className="py-0 fw-bold">
            {bt[0] && `${bt[0]} ${options[bt[1]]}`}
          </td>
          <td style={style} className="py-0">
            2-4 mins
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0">
            Clotting Time
          </td>
          <td style={style} className="py-0 fw-bold">
            {ct[0] && `${ct[0]} ${options[ct[1]]}`}
          </td>
          <td style={style} className="py-0">
            2-4 mins
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0">
            Reticulocytes
          </td>
          <td style={style} className="py-0 fw-bold">
            {troupe?.retic > 0 && troupe?.retic}
          </td>
          <td style={style} className="py-0">
            0.5-1.5%
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0">
            ESR
          </td>
          <td style={style} className="py-0 fw-bold">
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
