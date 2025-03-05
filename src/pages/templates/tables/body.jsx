import React from "react";
// import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
// import {
//   DESTROY,
//   SetEDIT,
// } from "../../../../../../services/redux/slices/liability/assurances";
import Swal from "sweetalert2";
// import { Services } from "../../../../../../services/fakeDb";

const Tables = () => {
  // const { token } = useSelector(({ auth }) => auth),
  //   { paginated } = useSelector(({ assurances }) => assurances),
  //   dispatch = useDispatch();

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
        // dispatch(DESTROY({ token, data: { _id } }));
        alert(_id);
      }
    });
  };

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>aka</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Tom</td>
          <td>Kuya TOM </td>
          <td>
            <button>Edit</button>
            <button onClick={() => handleDelete(1)}>Delete</button>
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
};

export default Tables;
