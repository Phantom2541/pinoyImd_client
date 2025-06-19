import React from "react";
import { MDBTable } from "mdbreact";
import { Cellcount, Diffcount } from "../../../../../../services/fakeDb";

export default function DiffCount({ dc, style }) {
  const { Category } = Diffcount,
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
            style={{
              fontSize: "1rem",
              verticalAlign: "middle",
              fontWeight: 400,
            }}
            className="py-0"
          >
            Differential Count
          </th>
          <th
            style={{
              fontSize: "1rem",
              verticalAlign: "middle",
              fontWeight: 400,
            }}
            className="py-0  text-center"
          >
            Results
          </th>
          <th
            style={{
              fontSize: "1rem",
              verticalAlign: "middle",
              fontWeight: 400,
            }}
            className="py-0 "
          >
            Reference
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.values(dc).map((diff, index) => {
          const category = Category[index],
            { lo, hi } = Preferences.differentials[category],
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
