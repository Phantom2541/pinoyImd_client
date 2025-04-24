import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { ResultInRange } from "../../../../../../services/fakeDb";

const Chemical = ({ style, Chemical }) => {
  const [
    sugar,
    protein,
    billirubin,
    ketone,
    blood,
    urobilinogen,
    nitrate,
    leukocytes,
  ] = Chemical || [null, null, null, null, null, null, null, null];

  return (
    <MDBTable bordered>
      <MDBTableHead>
        <tr>
          <th
            style={{ fontSize: "1.2rem" }}
            className="py-0 fw-bold text-left"
            colSpan={6}
          >
            Chemical Examination
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td style={{ ...style, width: "50%" }} className="py-0 ">
            Sugar
          </td>
          <td
            style={{ ...style, color: !!sugar && "red" }}
            className="py-0 fw-bold"
          >
            {ResultInRange[sugar]}
          </td>
        </tr>
        <tr>
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
        <tr>
          <td style={style} className="py-0 ">
            Protein
          </td>
          <td
            style={{ ...style, color: !!protein && "red" }}
            className="py-0 fw-bold"
          >
            {ResultInRange[protein]}
          </td>
        </tr>
        <tr>
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

        <tr>
          <td style={style} className="py-0 ">
            Bilirubin
          </td>
          <td
            style={{ ...style, color: !!billirubin && "red" }}
            className="py-0 fw-bold"
          >
            {ResultInRange[billirubin]}
          </td>
        </tr>
        <tr>
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
        <tr>
          <td style={style} className="py-0 ">
            Ketone
          </td>
          <td
            style={{ ...style, color: !!ketone && "red" }}
            className="py-0 fw-bold"
          >
            {ResultInRange[ketone]}
          </td>
        </tr>
        <tr>
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
      </MDBTableBody>
    </MDBTable>
  );
};

export default Chemical;
