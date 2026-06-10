import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBTable } from "mdbreact";
import {
  RESET,
  DESTROY,
  SET_COLLECTIONS,
} from "../../../../../services/redux/slices/assets/persons/physicians";
import { useToasts } from "react-toast-notifications";
import {
  properFullname,
  getPhysicianGenderIcon,
} from "../../../../../services/utilities";
import Swal from "sweetalert2";
export default function Body() {
  const { token, activePlatform } = useSelector(({ auth }) => auth),
    { filtered, collections, message, isSuccess, maxPage, activePage } =
      useSelector(({ physicians }) => physicians),
    [tieups, setTieups] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    setTieups(filtered);
  }, [filtered]);

  const handleDelete = (item) => {
    Swal.fire({
      title: `Are you sure to remove  ${String(
        properFullname(item?.user?.fullName, true)
      ).toUpperCase()}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          DESTROY({
            token,
            data: { id: item._id, branch: activePlatform?.branchId },
          })
        ).then(() => {
          const updated = [...collections].filter((i) => i._id !== item._id);
          console.log("updated", updated);
          dispatch(SET_COLLECTIONS(updated));
        });
      }
    });
  };
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = tieups.slice(startIndex, endIndex);

  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Department</th>
          <th>Position</th>
          <th>Specialization</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { user = {} } = item;
          const isGhost = !Boolean(item?.user?._id);
          const baseName = isGhost ? item?.ghostName : item?.user?.fullName;
          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
              <td>
                <strong>
                  {getPhysicianGenderIcon(user?.isMale ?? item?.isMale, isGhost)}
                  {properFullname(baseName)}
                </strong>
              </td>
              <td>{item?.department || "—"} </td>
              <td>{item?.position || "—"}</td>
              <td>{item?.specialization || "—"}</td>
              <td>
                <MDBBtn
                  color="danger"
                  size="sm"
                  onClick={() => handleDelete(item)}
                >
                  Untag
                </MDBBtn>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
}
