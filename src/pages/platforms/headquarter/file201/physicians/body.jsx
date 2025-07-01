import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RESET,
  DESTROY,
} from "../../../../../services/redux/slices/assets/persons/physicians";
import { useToasts } from "react-toast-notifications";
import DataTable from "../../../../../components/dataTable";
import {
  globalSearch,
  properFullname,
  getGenderIcon,
} from "../../../../../services/utilities";
import Swal from "sweetalert2";
// mobile;
export default function Body() {
  const { token } = useSelector(({ auth }) => auth),
    { collections, message, isSuccess, isLoading } = useSelector(
      ({ physicians }) => physicians
    ),
    [tieups, setTieups] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Set fetched data for mapping
  useEffect(() => {
    setTieups(collections);
  }, [collections]);

  //Trigger for update
  const handleDelete = (selected) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { id: selected._id } }));
      }
    });
  };

  //Trigger for create
  // const handleCreate = async () => {
  //   const { value: fullname } = await Swal.fire({
  //     title: "Input Physician Fullname",
  //     input: "text",
  //     inputLabel: "Physician Fullname",
  //     inputPlaceholder: "Lastname, Firstname y Middlename",
  //   });
  //   console.log("fullname", fullname);
  // };

  //Toast for errors or success
  useEffect(() => {
    if (message) {
      addToast(message, {
        appearance: isSuccess ? "success" : "error",
      });
    }

    return () => dispatch(RESET());
  }, [isSuccess, message, addToast, dispatch]);

  //Search function
  // const handleSearch = async (willSearch, key) => {
  //   if (willSearch) return setTieups(globalSearch(collections.tieups, key));

  //   setTieups(collections);
  // };
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialization</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tieups.map((item, index) => (
            <tr key={index}>
              <td>
                <strong>
                  {getGenderIcon(item?.user?.isMale)}
                  {String(
                    properFullname(item?.user?.fullName, true)
                  ).toUpperCase()}
                </strong>
              </td>
              <td>{item?.specialization || "—"}</td>
              <td>
                <button onClick={() => handleDelete(item)}>Untag</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
