import React from "react";
import { MDBTable } from "mdbreact";
import { Cellcount, Rci as RCI } from "../../../../../../../services/fakeDb";
// import { calculateIndicators } from "../../../../../services/utilities";

const options = ["00", "15", "30", "45"];

export default function Rci({ rci = [], style, troupe, ct = [], bt = [] }) {
  const { Category } = RCI,
    { Preferences } = Cellcount;

  return (
    <MDBTable hover bordered responsive className="mb-0">
      <thead>
        <tr
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)", // black with 10% opacity
            color: "#fff", // optional: white text for contrast
          }}
        >
          <th
            className="py-0 "
            style={{
              fontSize: "1rem",
              verticalAlign: "middle",
              fontWeight: 400,
            }}
          >
            Red Cell Immunohaematology
          </th>
          <th
            className="py-0 text-center"
            style={{
              fontSize: "1rem",
              verticalAlign: "middle",
              fontWeight: 400,
            }}
          >
            Results
          </th>
          <th
            className="py-0"
            style={{
              fontSize: "1rem",
              verticalAlign: "middle",
              fontWeight: 400,
            }}
          >
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
            {bt[0] && `${bt[0]} ${options[bt[1]]}`}
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
            {ct[0] && `${ct[0]} ${options[ct[1]]}`}
          </td>
          <td style={style} className="py-0">
            2-4 mins
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0">
            <span className="ml-2"> Reticulocytes</span>
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
            <span className="ml-2">ESR</span>
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
