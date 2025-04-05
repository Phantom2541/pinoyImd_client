import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable } from "mdbreact";
import Swal from "sweetalert2";
import {
  SetSELECTED,
  DESTROY,
} from "../../../../../services/redux/slices/assets/providers";
const Body = () => {
  const { token } = useSelector(({ auth }) => auth),
    { filtered, activePage, maxPage } = useSelector(
      ({ providers }) => providers
    ),
    dispatch = useDispatch();

  const handleEdit = (service) => {
    dispatch(SetSELECTED(service));
    //console.log("SetSelected service :", service);
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
  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Number</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((service, index) => (
          <tr key={index}>
            <td key={index}>{index + startIndex + 1}</td>
            <td>{service.displayname}</td>
            <td>{service.number} </td>
            <td>{service.address}</td>
            <td className="text-center">
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleEdit(service)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(service._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </MDBTable>
  );
};

export default Body;
