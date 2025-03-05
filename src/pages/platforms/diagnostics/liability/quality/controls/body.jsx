import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable } from "mdbreact";
import {
  DESTROY,
  SetEDIT,
} from "../../../../../../services/redux/slices/liability/controls";
import Swal from "sweetalert2";

import { Services } from "../../../../../../services/fakeDb";
// import { handlePagination } from "../../../../../../services/utilities";
const Tables = () => {
  const { token } = useSelector(({ auth }) => auth),
    { paginated } = useSelector(({ controls }) => controls),
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
          <th>Service ID</th>
          <th>Abnormal</th>
          <th>High</th>
          <th>Normal</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        {!paginated.length && <tr>No Data</tr>}
        {paginated.map((control, index) => (
          <tr key={index}>
            <td style={{ minHeight: "30px" }}>
              {Services.getName(control?.serviceId)}
            </td>
            <td>{control?.abnormal}</td>
            <td>{control?.high}</td>
            <td>{control?.normal}</td>
            <td>
              {new Date(control?.createdAt).toLocaleDateString("en-GB", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })}
            </td>
            <td>
              <button onClick={() => dispatch(SetEDIT(control))}>Edit</button>
              <button onClick={() => handleDelete(control._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </MDBTable>
  );
};

export default Tables;
