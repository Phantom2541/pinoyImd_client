import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import {
  MicroscopicInRange,
  MicroscopicResultInWord,
} from "../../../../../../services/fakeDb";

const Microscopic = ({ Microscopic, style }) => {
  const [pus, red, epithelial, mucus, amorphous, bacteria] = Microscopic || [
    null,
    null,
    null,
    null,
    null,
    null,
  ];

  return (
    <MDBTable bordered>
      <MDBTableHead>
        <tr>
          <th
            className="py-0 text-left fw-bold"
            style={{ fontSize: "1.2rem" }}
            colSpan={8}
          >
            Microscopic Examination
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td style={{ ...style, width: "50%" }} className="py-0 ">
            PUS
          </td>
          <td
            style={{ ...style, color: pus > 2 && "red" }}
            className="py-0 fw-bold"
          >
            {MicroscopicInRange[pus]}
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0 ">
            Epithelial Cell
          </td>
          <td style={style} className="py-0 fw-bold">
            {MicroscopicResultInWord[epithelial]}
          </td>
        </tr>
        <tr>
          <td style={style} className="py-0 ">
            Amorphous urates
          </td>
          <td style={style} className="py-0 fw-bold">
            {MicroscopicResultInWord[amorphous]}
          </td>
        </tr>
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
        </tr>
        <tr>
          <td style={style} className="py-0 ">
            Mucus Threads
          </td>
          <td
            style={{ ...style, color: mucus > 1 && "red" }}
            className="py-0 fw-bold"
          >
            {MicroscopicResultInWord[mucus]}
          </td>
        </tr>
        <tr>
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
      </MDBTableBody>
    </MDBTable>
  );
};

export default Microscopic;
