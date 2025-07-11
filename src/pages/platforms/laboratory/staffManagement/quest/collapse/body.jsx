import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import Swal from "sweetalert2";
import { fullName } from "../../../../../../services/utilities";
import {
  SetTeam,
  UPDATE,
} from "../../../../../../services/redux/slices/diagnostics/clinician/quest";

export default function Collapsable({ team = [], _id }) {
  const dispatch = useDispatch();
  const { token } = useSelector(({ auth }) => auth);

  const handleRemove = (member) => {
    const newTeam = team.filter((t) => t.userId._id !== member.userId._id);
    Swal.fire({
      title: `Remove ${fullName(member.userId.fullName)}?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(UPDATE({ token, data: { _id, team: newTeam } }));
      }
    });
  };

  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          <th style={{ width: "5%" }} className="text-center">
            #
          </th>
          <th style={{ width: "20%" }}>Name</th>
          <th style={{ width: "15%" }}>Role</th>
          <th style={{ width: "15%" }}>Phone</th>
          <th style={{ width: "10%" }}>Notified</th>
          <th style={{ width: "15%" }} className="text-center">
            Action
            <div className="mt-2">
              <button
                className="btn btn-sm btn-primary rounded-pill d-flex align-items-center justify-content-center mx-auto"
                onClick={() => {
                  dispatch(SetTeam({ _id, team }));
                }}
              >
                <i className="fa fa-plus mr-1" />
                Add Member
              </button>
            </div>
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {team?.map((member, i) => (
          <tr key={i}>
            <td className="text-center">{i + 1}</td>
            <td title={fullName(member.userId.fullName)}>
              {member.userId.alias}
            </td>
            <td>{member.role}</td>
            <td>{member.userId.phoneNumber}</td>
            <td>{member.hasInformed ? "Yes" : "No"}</td>
            <td className="text-center">
              <button
                className="btn btn-sm btn-danger rounded-pill"
                onClick={() => handleRemove(member)}
              >
                Untag
              </button>
            </td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}
