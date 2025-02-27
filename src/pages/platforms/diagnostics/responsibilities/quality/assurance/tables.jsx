import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";
import {
  DESTROY,
  SetEDIT,
} from "../../../../../../services/redux/slices/responsibilities/assurances";
import Swal from "sweetalert2";

import { Services } from "../../../../../../services/fakeDb";
import { handlePagination } from "../../../../../../services/utilities";

const Tables = () => {
  const { maxPage, token } = useSelector(({ auth }) => auth),
    { collections, page } = useSelector(({ assurances }) => assurances),
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
    <MDBTable responsive hover bordered>
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
        {handlePagination(collections, page, maxPage)?.map(
          (assurance, index) => {
            return (
              <tr key={index}>
                <td>{Services.getName(assurance?.serviceId)}</td>
                <td>{assurance?.abnormal}</td>
                <td>{assurance?.high}</td>
                <td>{assurance?.normal}</td>
                {/* <td>{control?.createdAt}</td> */}
                <td>
                  {new Date(assurance?.createdAt).toLocaleDateString("en-GB", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <button onClick={() => dispatch(SetEDIT(assurance))}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(assurance._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            );
          }
        )}
      </tbody>
    </MDBTable>
  );
};

export default Tables;
