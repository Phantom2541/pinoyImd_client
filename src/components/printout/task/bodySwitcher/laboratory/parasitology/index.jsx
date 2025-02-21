import React from "react";
import { MDBTable } from "mdbreact";
import {
  BacteriaInRange,
  Consistency,
  FecalColor,
  MicroscopicInRange,
  MicroscopicResultInWord,
  PH,
} from "../../../../../../services/fakeDb";

export default function Parasitology({ fontSize, task }) {
  const style = { fontSize: `${fontSize}rem` },
    { pe, ce, me } = task,
    [color, consistency] = pe || [null, null],
    [pH, occult] = ce || [null, null],
    [pus, red, bac, yeast, fat] = me || [null, null];
  console.log("occult", occult);
  return (
    <MDBTable hover bordered responsive className="mb-0">
      <thead>
        <tr>
          <th style={style} className="py-0">
            Name
          </th>
          <th style={style} className="py-0">
            Result
          </th>
          <th className="py-0" />
          <th style={style} className="py-0">
            Name
          </th>
          <th style={style} className="py-0">
            Result
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={style} className="py-0 text-left">
            Color
          </td>
          <td
            style={{ ...style, color: color > 3 && "red" }}
            className="py-0 fw-bold"
          >
            {FecalColor[color]}
          </td>
          <td className="py-0" />
          <td style={style} className="py-0 text-left">
            Stool pH
          </td>
          <td style={style} className="py-0 fw-bold">
            {PH[pH]}
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0 text-left">
            Consistency
          </td>
          <td
            style={{ ...style, color: color > 3 && "red" }}
            className="py-0 fw-bold"
          >
            {Consistency[consistency]}
          </td>
          <td className="py-0" />
          <td style={style} className="py-0">
            Yeast Cells
          </td>
          <td
            style={{ ...style, color: color > 3 && "red" }}
            className="py-0 fw-bold"
          >
            {MicroscopicResultInWord[yeast]}
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0">
            Pus cells
          </td>
          <td
            style={{ ...style, color: color > 3 && "red" }}
            className="py-0 fw-bold"
          >
            {MicroscopicInRange[pus]}
          </td>

          <td className="py-0" />
          <td style={style} className="py-0">
            Fat Globules
          </td>
          <td
            style={{ ...style, color: color > 3 && "red" }}
            className="py-0 fw-bold"
          >
            {MicroscopicResultInWord[fat]}
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0">
            Red cells
          </td>
          <td
            style={{ ...style, color: color > 3 && "red" }}
            className="py-0 fw-bold"
          >
            {MicroscopicInRange[red]}
          </td>

          <td className="py-0" />
          <td style={style} className="py-0 text-left">
            Occult Blood
          </td>
          <td style={style} className="py-0 fw-bold">
            {occult === undefined
              ? ""
              : occult === "0"
              ? "Negative"
              : "Positive"}
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0">
            Bacteria
          </td>
          <td
            style={{ ...style, color: color > 3 && "red" }}
            className="py-0 fw-bold"
          >
            {BacteriaInRange[bac]}
          </td>
          <td className="py-0" />
          <td className="py-0" />
          <td className="py-0" />
        </tr>
      </tbody>
    </MDBTable>
  );
}
