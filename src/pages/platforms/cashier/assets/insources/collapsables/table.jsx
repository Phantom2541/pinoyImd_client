import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import { fullName } from "../../../../../../services/utilities";
import { UntagPHYSICIAN } from "../../../../../../services/redux/slices/assets/branches";

export default function CollapseTable({ BranchId, affiliated }) {
  const { auth, token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();
  const handleUntag = (physicianId) => {
    dispatch(
      UntagPHYSICIAN({
        data: {
          physicianId,
          BranchId,
        },
        token,
      })
    );
  };

  return (
    <MDBTable striped bordered>
      <MDBTableHead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Gender</th>
          <th>Phone</th>
          <th>Actions</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {!affiliated.length && (
          <tr>
            <td colSpan={5} className="text-center">
              No Physicians where tag
            </td>
          </tr>
        )}
        {affiliated.map(({ _id, specialization, user }, index) => (
          <tr key={_id}>
            {<td>{index + 1}</td>}
            <td>
              <h5>{fullName(user.fullName)} </h5>
              <small>{specialization}</small>
            </td>
            <td>{user?.isMale ? "Male" : "Female"}</td>
            <td>{user?.phone}</td>
            <td>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => handleUntag(_id)}
              >
                Edit
              </button>
            </td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}
