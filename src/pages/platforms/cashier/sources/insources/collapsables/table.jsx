import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBadge,
  MDBBtn,
  MDBIcon,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import { fullName } from "../../../../../../services/utilities";
import { UntagPHYSICIAN } from "../../../../../../services/redux/slices/assets/branches";
import { SetBRANCHES } from "../../../../../../services/redux/slices/assets/providers";

export default function CollapseTable({ BranchId, affiliated, providerId }) {
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
    ).then(() => {
      dispatch(SetBRANCHES({ providerId, physicianId }));
    });
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
            <td style={{ fontWeight: 400 }}>
              <div className="d-flex flex-column">
                {fullName(user.fullName)}
              </div>
              <MDBBadge>{specialization}</MDBBadge>
            </td>
            <td>{user?.isMale ? "Male" : "Female"}</td>
            <td>{user?.mobile}</td>
            <td>
              <MDBBtn color="danger" size="sm" onClick={() => handleUntag(_id)}>
                <MDBIcon fas icon="user-times" className="mr-2" /> Untag
              </MDBBtn>
            </td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}
