import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBadge } from "mdbreact";
import { fullName } from "../../../../../services/utilities";
import { capitalize } from "lodash";

export default function Collapsable({ branches, ceo }) {
  return (
    <MDBTable bordered>
      <MDBTableHead>
        <tr>
          <th>Branch Name</th>
          <th>displayname</th>
          <th>Acronym</th>
          <th>Category</th>
          <th>AO</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {branches?.map((branch, index) => {
          const { isMain = false } = branch;
          return (
            <tr key={index}>
              <td>
                <strong className="mr-1"> {++index}.</strong>
                {branch?.name}
                {isMain && (
                  <MDBBadge color="warning" className="ml-2">
                    Main
                  </MDBBadge>
                )}
              </td>
              <td>{branch?.displayname}</td>
              <td>{branch?.acronym}</td>
              <td>{capitalize(branch?.category)}</td>
              <td>{fullName(branch?.ao?.fullName)}</td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
