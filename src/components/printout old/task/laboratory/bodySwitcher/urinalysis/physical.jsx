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
    <MDBTable bordered>
      <MDBTableHead>
        <tr>
          <th
            className="py-0 text-left fw-bold"
            style={{ fontSize: "1.2rem" }}
            colSpan={8}
          >
            Physical Examination
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td style={{ ...style, width: "50%" }} className="py-0 ">
            <span className="ml-2">Color</span>
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
            <span className="ml-2"> Transparency</span>
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
            <span className="ml-2">Specific Gravity</span>
          </td>
          <td style={style} className="py-0 fw-bold">
            {SpecificGravity[sg]}
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0">
            <span className="ml-2">Reaction/ pH</span>
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
