import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable } from "mdbreact";
import {
  DESTROY,
  SetEDIT,
} from "../../../../../services/redux/slices/assets/providers";
import Swal from "sweetalert2";

const Tables = () => {
  const { token } = useSelector(({ auth }) => auth);
  const { paginated } = useSelector(({ providers }) => providers);
  const dispatch = useDispatch();

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
      if (result.isConfirmed) dispatch(DESTROY({ token, data: { _id } }));
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
        {paginated?.length ? (
          paginated.map(({ vendors, name, subName, ao }, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                {vendors ? (
                  <span>
                    {vendors.displayname} {vendors.name}
                  </span>
                ) : (
                  <span>
                    {name} {subName || ""}
                  </span>
                )}
              </td>
              {/* <td>
                {fullName(ao?.fullName)} <br /> {ao?.email} <br /> {ao?.mobile}
              </td> */}
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
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              No data
            </td>
          </tr>
        )}
      </tbody>
    </MDBTable>
  );
};

export default Tables;
