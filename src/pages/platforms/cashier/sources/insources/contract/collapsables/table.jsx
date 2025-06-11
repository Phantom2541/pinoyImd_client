import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBadge,
  MDBBtn,
  MDBBtnGroup,
  MDBIcon,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdbreact";
import "./styles.css";

import { fullName } from "../../../../../../../services/utilities";
import { UntagPHYSICIAN } from "../../../../../../../services/redux/slices/assets/branches";
import { SetBRANCHES } from "../../../../../../../services/redux/slices/assets/providers";
import { UPDATE as UPDATEGHOST } from "../../../../../../../services/redux/slices/assets/persons/physicians";
import { SAVE } from "../../../../../../../services/redux/slices/assets/persons/users";
import { Input } from "../../../../../../../components/customizable";
import { RESET } from "../../../../../../../services/redux/slices/assets/persons/physicians";
import { useToasts } from "react-toast-notifications";

export default function CollapseTable({ BranchId, affiliated, providerId }) {
  const { token } = useSelector(({ auth }) => auth),
    { formSubmitted, isSuccess } = useSelector(({ physicians }) => physicians),
    [selected, setSelected] = useState(-1),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (!formSubmitted && isSuccess) {
      dispatch(RESET());
    }
  }, [formSubmitted, isSuccess, dispatch]);
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

  const handleGhostUpdate = (user) => {
    dispatch(UPDATEGHOST(user));
  };
  const handleUpdate = () => {
    const { newSpecialization, specialization } = selected;
    if (newSpecialization.toLowerCase() === specialization.toLowerCase()) {
      setSelected({});
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }
    dispatch(
      UPDATEGHOST({
        data: { _id: selected._id, specialization: newSpecialization },
        token,
      })
    )
      .then(({ payload: physician }) => {
        const { _id: physicianId } = physician;

        dispatch(
          SetBRANCHES({
            physicianId,
            affiliated: physician,
            providerId,
            isUpdatePhysician: true,
          })
        );

        setSelected({}); // Reset state after update
      })
      .catch((error) => console.error("Update Error:", error));
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
                {_id === selected?._id ? (
                  <div style={{ width: "13rem" }}>
                    <Input
                      _key={"newSpecialization"}
                      className="mt-2 form-control form-control-sm"
                      formSubmitted={formSubmitted}
                      isSuccess={isSuccess}
                      selected={selected}
                      onChange={(key, value) =>
                        setSelected({ ...selected, [key]: value })
                      }
                      handleCheck={handleUpdate}
                      handleClose={() => setSelected({})}
                    />
                  </div>
                ) : (
                  <MDBBadge
                    title="Click me to update"
                    className="cursor-pointer"
                    onClick={() =>
                      setSelected({
                        _id,
                        specialization,
                        user,
                        newSpecialization: specialization,
                      })
                    }
                  >
                    {specialization}
                  </MDBBadge>
                )}
              </td>
              <td>{user?.isMale ? "Male" : "Female"}</td>
              <td>{user?.mobile}</td>
              <td>
                <MDBBtnGroup>
                  {!user && (
                    <>
                      <MDBBtn
                        color="success"
                        rounded
                        size="sm"
                        onClick={() => handleRegister(physician)}
                      >
                        <span role="img" aria-label="ghost">
                          👻
                        </span>{" "}
                        Register
                      </MDBBtn>
                      <MDBBtn
                        color="info"
                        rounded
                        size="sm"
                        onClick={() => handleGhostUpdate(physician)}
                      >
                        <span role="img" aria-label="ghost">
                          👻
                        </span>{" "}
                        Edit
                      </MDBBtn>
                    </>
                  )}

                  <MDBBtn
                    color="danger"
                    size="sm"
                    rounded
                    onClick={() => handleUntag(_id)}
                  >
                    <MDBIcon icon="user-times" className="mr-2" /> Untag
                  </MDBBtn>
                </MDBBtnGroup>
              </td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
