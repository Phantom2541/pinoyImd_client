import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable } from "mdbreact";
import {
  DESTROY,
  SetEDIT,
} from "../../../../../services/redux/slices/assets/providers";
import { fullName } from "../../../../../services/utilities";
import Swal from "sweetalert2";

const Tables = () => {
  const { token } = useSelector(({ auth }) => auth),
    { paginated } = useSelector(({ providers }) => providers),
    dispatch = useDispatch();

  const handleDelete = (_id) => {
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
        dispatch(DESTROY({ token, data: { _id } }));
      }
    });
  };

  return (
    <MDBTable responsive hover bordered style={{ minHeight: "300px" }}>
      <thead>
        <tr>
          <th>#</th>
          <th>Company Name</th>
          <th>Contact Person</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {!paginated?.length && (
          <tr>
            <td colSpan="2">No data</td>
          </tr>
        )}
        {paginated?.map(({ vendors, name, subName, ao }, index) => {
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {vendors
                  ? `${vendors.companyName} ${vendors.name}`
                  : `${name} ${subName || ""}`}
              </td>

              <td>
                {fullName(ao?.fullName)} <br /> {ao?.email} <br /> {ao?.mobile}
              </td>
              <td>
                <button
                  onClick={() =>
                    dispatch(SetEDIT(vendors || { name, subName }))
                  }
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(vendors?._id || name)}>
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Tables;
