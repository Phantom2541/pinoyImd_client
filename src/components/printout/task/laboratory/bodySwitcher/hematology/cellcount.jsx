import React from "react";
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
              <td style={style} className="py-0">
                {Title[index]}
              </td>
              <td
                style={{
                  ...style,
                  color,
                }}
                className="py-0 fw-bold"
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
          <td style={style} className="py-0" colSpan={3}>
            &nbsp;
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0">
            APC
          </td>
          <td style={style} className="py-0 fw-bold">
            {apc}
          </td>
          <td style={style} className="py-0">
            150-450 <sup>9</sup>/L
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
}
