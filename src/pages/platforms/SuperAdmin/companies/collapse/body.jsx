import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { fullName } from "../../../../../services/utilities";

export default function Collapsable({ branches, ceo }) {
  return (
    <MDBTable bordered>
      <MDBTableHead>
        <tr>
          <th>#</th>
          <th>is Main</th>
          <th>Branches Name</th>
          <th>displayname</th>
          <th>Acronym</th>
          <th>AO</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {branches?.map((branch, index) => (
          <tr key={index}>
            <td>{++index}</td>
            <td>{branch?.isMain ? "yes" : "-"}</td>
            <td>{branch?.name}</td>
            <td>{branch?.displayname}</td>
            <td>{branch?.acronym}</td>
            <td>{fullName(branch?.ao?.fullName)}</td>
          </tr>
        ))}
      </MDBTableBody>
      <h5>CEO: {fullName(ceo?.fullName)}</h5>
    </MDBTable>
  );
}
