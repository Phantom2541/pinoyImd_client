import React from "react";
import { MDBTable } from "mdbreact";
import {
  MicroscopicInRange,
  MicroscopicResultInWord,
  PH,
  ResultInRange,
  SpecificGravity,
  Transparency,
  UrineColors,
} from "../../../../../../services/fakeDb";

export default function Urinalysis({ fontSize, task }) {
  const style = { fontSize: `${fontSize}rem` },
    { pe, ce, me } = task,
    [color, transparency, sg, pH] = pe || [null, null, null, null],
    [
      sugar,
      protein,
      billirubin,
      ketone,
      blood,
      urobilinogen,
      nitrate,
      leukocytes,
    ] = ce || [null, null, null, null, null, null, null, null],
    [pus, red, epithelial, mucus, amorphous, bacteria] = me || [
      null,
      null,
      null,
      null,
      null,
      null,
    ];

  return (
    <MDBTable hover bordered responsive className="mb-0">
      <thead className="text-center">
        <tr>
          <th style={style} className="py-0" colSpan={2}>
            Physical Examination
          </th>
          <th style={style} className="py-0" colSpan={6}>
            Chemical Examination
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={style} className="py-0">
            Color
          </td>
          <td
            style={{ ...style, color: color > 3 && "red" }}
            className="py-0 fw-bold"
          >
            {UrineColors[color]}
          </td>
          <td className="py-0" />
          <td style={style} className="py-0 ">
            Sugar
          </td>
          <td
            style={{ ...style, color: !!sugar && "red" }}
            className="py-0 fw-bold"
          >
            {ResultInRange[sugar]}
          </td>
          <td className="py-0" />
          <td style={style} className="py-0 ">
            Blood
          </td>
          <td
            style={{ ...style, color: !!blood && "red" }}
            className="py-0 fw-bold"
          >
            {ResultInRange[blood]}
          </td>
        </tr>
        {/* row 2 */}

        <tr>
          <td style={style} className="py-0">
            Transparency
          </td>
          <td
            style={{ ...style, color: !!transparency && "red" }}
            className="py-0 fw-bold"
          >
            {Transparency[transparency]}
          </td>
          <td className="py-0" />
          <td style={style} className="py-0 ">
            Protein
          </td>
          <td
            style={{ ...style, color: !!protein && "red" }}
            className="py-0 fw-bold"
          >
            {ResultInRange[protein]}
          </td>
          <td className="py-0" />
          <td style={style} className="py-0 ">
            Urobilinogen
          </td>
          <td
            style={{ ...style, color: !!urobilinogen && "red" }}
            className="py-0 fw-bold"
          >
            {ResultInRange[urobilinogen]}
          </td>
        </tr>
        {/* row 3 */}

        <tr>
          <td style={style} className="py-0">
            Specific Gravity
          </td>
          <td style={style} className="py-0 fw-bold">
            {SpecificGravity[sg]}
          </td>
          <td className="py-0" />
          <td style={style} className="py-0 ">
            Bilirubin
          </td>
          <td
            style={{ ...style, color: !!billirubin && "red" }}
            className="py-0 fw-bold"
          >
            {ResultInRange[billirubin]}
          </td>
          <td className="py-0" />
          <td style={style} className="py-0 ">
            Nitrate
          </td>
          <td
            style={{ ...style, color: !!nitrate && "red" }}
            className="py-0 fw-bold"
          >
            {ResultInRange[nitrate]}
          </td>
        </tr>
        {/* row 4 */}

        <tr>
          <td style={style} className="py-0">
            Reaction/ pH
          </td>
          <td style={{ ...style }} className="py-0 fw-bold">
            {PH[pH]}
          </td>
          <td className="py-0" />
          <td style={style} className="py-0 ">
            Ketone
          </td>
          <td
            style={{ ...style, color: !!ketone && "red" }}
            className="py-0 fw-bold"
          >
            {ResultInRange[ketone]}
          </td>
          <td className="py-0" />
          <td style={style} className="py-0 ">
            Leukocytes
          </td>
          <td
            style={{ ...style, color: !!leukocytes && "red" }}
            className="py-0 fw-bold"
          >
            {ResultInRange[leukocytes]}
          </td>
        </tr>
        {/* row 5 */}

        <tr>
          <td style={style} className="py-0 text-center" colSpan={8}>
            Microscopic Examination
          </td>
        </tr>
        {/* row 6 */}

        <tr>
          <td style={style} className="py-0">
            PUS
          </td>
          <td
            style={{ ...style, color: pus > 2 && "red" }}
            className="py-0 fw-bold"
          >
            {MicroscopicInRange[pus]}
          </td>
          <td className="py-0" />
          <td style={style} className="py-0 ">
            Epithelial Cell
          </td>
          <td style={style} className="py-0 fw-bold">
            {MicroscopicResultInWord[epithelial]}
          </td>
          <td className="py-0" />
          <td style={style} className="py-0 ">
            Amorphous urates
          </td>
          <td style={style} className="py-0 fw-bold">
            {MicroscopicResultInWord[amorphous]}
          </td>
        </tr>
        {/* row 7 */}
        <tr>
          <td style={style} className="py-0">
            Red cells
          </td>
          <td
            style={{ ...style, color: red > 2 && "red" }}
            className="py-0 fw-bold"
          >
            {MicroscopicInRange[red]}
          </td>
          <td className="py-0" />
          <td style={style} className="py-0 ">
            Mucus Threads
          </td>
          <td
            style={{ ...style, color: mucus > 1 && "red" }}
            className="py-0 fw-bold"
          >
            {MicroscopicResultInWord[mucus]}
          </td>
          <td className="py-0" />
          <td style={style} className="py-0 ">
            Bacteria
          </td>
          <td
            style={{ ...style, color: bacteria > 1 && "red" }}
            className="py-0 fw-bold"
          >
            {MicroscopicResultInWord[bacteria]}
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
}
