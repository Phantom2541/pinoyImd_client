import React from "react";
import { MDBTable } from "mdbreact";
import { Cellcount, Diffcount } from "../../../../../../services/fakeDb";

export default function DiffCount({ dc, style }) {
  const { Category } = Diffcount,
    { Preferences } = Cellcount;

  return (
    <MDBTable hover bordered responsive className="mb-0">
      <thead>
        <tr>
          <th style={style} className="py-0">
            Category
          </th>
          <th style={style} className="py-0">
            Results
          </th>
          <th style={style} className="py-0">
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
