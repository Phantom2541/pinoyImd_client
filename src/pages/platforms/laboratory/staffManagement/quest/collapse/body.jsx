import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import {
  SetEDIT,
  SetFILTER,
} from "../../../../../../services/redux/slices/diagnostics/clinician/quest";
import { Search } from "../../../../../../components/searchables";
import Swal from "sweetalert2";
import { fullName, properFullname } from "../../../../../../services/utilities";
import { UPDATE } from "../../../../../../services/redux/slices/assets/companies";

export default function Collapsable({ team, _id }) {
  const { token } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  const handleUpdate = (item) => dispatch(SetEDIT(item));
  // const handleAdd = (item) => dispatch(SetTeam(item));

  const handleRemove = (member) => {
    const newTeam = team.filter(
      (t) => t.userId._id.toString() !== member.userId._id.toString()
    );

    Swal.fire({
      title: `Are you sure you want to untag ${fullName(
        member.userId.fullName
      )}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, untag it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          UPDATE({
            token,
            data: { _id, team: newTeam },
          })
        );
      }
    });
  };

  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Role</th>
          <th>Phone Number</th>
          <th>Inform</th>
          <th>
            <div className="d-flex align-items-center">
              <span className="mr-2">Action</span>
              <Search
                collection={team}
                setFiltered={(selected) => dispatch(SetFILTER(selected))}
                placeHolder="Search name"
                HaveAction={false}
                hideButton={true}
                reset={() => dispatch(SetFILTER(team))}
              />
            </div>
          </th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {team?.map((member, index) => {
          const { hasInformed, role, userId } = member;
          const { fullName: uFullName, alias, phoneNumber } = userId;

          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td title={properFullname(uFullName)}>{alias}</td>
              <td>{role}</td>
              <td>{phoneNumber}</td>
              <td>{hasInformed ? "Informed" : "Not Informed"}</td>
              <td>
                <button
                  onClick={() => handleUpdate(member)}
                  className="btn btn-sm btn-primary mr-2"
                  style={{ borderRadius: "10px", padding: "3.5px 10px" }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleRemove(member)}
                  className="btn btn-danger"
                  style={{ borderRadius: "10px", padding: "3.5px 10px" }}
                >
                  Untag
                </button>
              </td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
