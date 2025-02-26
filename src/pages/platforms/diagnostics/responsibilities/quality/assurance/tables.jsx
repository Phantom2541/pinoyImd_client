import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable } from "mdbreact";

import { Services } from "../../../../../../services/fakeDb";
import { handlePagination } from "../../../../../../services/utilities";
import { DESTROY } from "../../../../../../services/redux/slices/responsibilities/assurances";
import Swal from "sweetalert2";

const Tables = ({ page, setSelected, setWillCreate, setShowModal }) => {
  const { maxPage, token } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ assurances }) => assurances),
    [assurances, setAssurances] = useState([]),
    dispatch = useDispatch;

  useEffect(() => {
    setAssurances(collections);
  }, [collections]);

  const handleEdit = (assurance) => {
    setSelected(assurance);
    setWillCreate(false);
    setShowModal(true);
  };

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
        {handlePagination(assurances, page, maxPage)?.map(
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
                  <button onClick={() => handleEdit(assurance)}>Edit</button>
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
