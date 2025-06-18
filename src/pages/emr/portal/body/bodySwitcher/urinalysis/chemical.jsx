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
            className="py-0 text-left p-1"
            style={{
              fontWeight: 400,
              fontSize: "1.2rem",
              backgroundColor: "rgba(0, 0, 0, 0.6)", // black with 10% opacity
              color: "#fff", // optional: white text for contrast
            }}
            colSpan={6}
          >
            Chemical Examination
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td style={{ ...style, width: "50%" }} className="py-0 ">
            <span className="ml-2">Sugar</span>
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
            <span className="ml-2">Blood</span>
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
            <span className="ml-2">Protein</span>
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
            <span className="ml-2">Urobilinogen</span>
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
            <span className="ml-2">Bilirubin</span>
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
            <span className="ml-2">Nitrate</span>
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
            <span className="ml-2">Ketone</span>
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
            <span className="ml-2">Leukocytes</span>
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
