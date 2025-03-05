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
import { UPDATE as UPDATEGHOST } from "../../../../../../services/redux/slices/assets/persons/physicians";
import {
  UPDATE as UPDATEUSER,
  SAVE,
} from "../../../../../../services/redux/slices/assets/persons/users";

export default function CollapseTable({ BranchId, affiliated, providerId }) {
  const { token } = useSelector(({ auth }) => auth),
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
  const handleRegister = (user) => {
    dispatch(SAVE({ ...user, token }));
  };
  const handleEdit = (user) => {
    dispatch(UPDATEUSER(user));
  };
  const handleGhostUpdate = (user) => {
    dispatch(UPDATEGHOST(user));
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
        {affiliated.map((physician, index) => {
          const { _id, specialization, user, ghostName } = physician;
          return (
            <tr key={_id}>
              {<td>{index + 1}</td>}
              <td style={{ fontWeight: 400 }}>
                <div className="d-flex flex-column">
                  {user ? fullName(user?.fullName) : fullName(ghostName)}
                </div>
                <MDBBadge>{specialization}</MDBBadge>
              </td>
              <td>{user?.isMale ? "Male" : "Female"}</td>
              <td>{user?.mobile}</td>
              <td>
                {user ? (
                  <MDBBtn
                    color="danger"
                    size="sm"
                    onClick={() => handleEdit(physician)}
                  >
                    <MDBIcon fas icon="user-times" className="mr-2" /> Edit
                  </MDBBtn>
                ) : (
                  <>
                    <MDBBtn
                      color="danger"
                      size="sm"
                      onClick={() => handleRegister(physician)}
                    >
                      👻 Register
                    </MDBBtn>
                    <MDBBtn
                      color="danger"
                      size="sm"
                      onClick={() => handleGhostUpdate(physician)}
                    >
                      👻 Edit
                    </MDBBtn>
                  </>
                )}

                <MDBBtn
                  color="danger"
                  size="sm"
                  onClick={() => handleUntag(_id)}
                >
                  <MDBIcon fas icon="user-times" className="mr-2" /> Untag
                </MDBBtn>
              </td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
