import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { properFullname } from "../../../../../../services/utilities";
import { Policy } from "../../../../../../services/fakeDb";

export default function Collapsable({ secretary = [] }) {
  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          <th>#</th>
          <th>Full Name</th>
          <th>Department</th>
          <th>Shift Schedule</th>
          <th>contract</th>
          <th>Status</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {secretary.map(({ user, hasSchedule, contract, status, id }, index) => (
          <tr key={index}>
            <td>{id}</td>
            <td>
              <small>{properFullname(user.fullName) || ""}</small>
            </td>
            <td>
              <small>{Policy.getDepartment(contract.designation) || ""}</small>
            </td>
            <td>
              <small>{hasSchedule || ""}</small>
            </td>
            <td>
              <small>{contract.soe || ""}</small>
            </td>
            <td>
              <small>{status || ""}</small>
            </td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}
