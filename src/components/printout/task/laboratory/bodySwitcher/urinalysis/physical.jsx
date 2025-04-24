import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import {
  Transparency,
  UrineColors,
  SpecificGravity,
  PH,
} from "../../../../../../services/fakeDb";

const Physical = ({ physical, style }) => {
  const [color, transparency, sg, pH] = physical;
  return (
    <MDBTable>
      <MDBTableHead>
        <tr>
          <th style={style} className="py-0" colSpan={2}></th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
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
        </tr>
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
        </tr>
        <tr>
          <td style={style} className="py-0">
            Specific Gravity
          </td>
          <td style={style} className="py-0 fw-bold">
            {SpecificGravity[sg]}
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0">
            Reaction/ pH
          </td>
          <td style={{ ...style }} className="py-0 fw-bold">
            {PH[pH]}
          </td>
        </tr>
      </MDBTableBody>
    </MDBTable>
  );
};

export default Physical;
