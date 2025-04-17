import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { fullName } from "../../../../../../services/utilities";

export default function Collapsable({ personnels }) {
  console.log("personnels", personnels);

  return (
    <MDBTable bordered>
      <MDBTableHead>
        <tr>
          <th>Name</th>
          <th>Designation</th>
          <th>Email </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {Array.isArray(personnels) &&
          personnels?.map((personnel, index) => (
            <tr key={index}>
              <td>{fullName(personnel?.user?.fullName)}</td>
              <td>{personnel?.designation}</td>
              <td>{personnel?.email}</td>
            </tr>
          ))}
      </MDBTableBody>
    </MDBTable>
  );
}
