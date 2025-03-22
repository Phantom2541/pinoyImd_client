import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable, MDBBtnGroup, MDBBtn } from "mdbreact";
import {
  DESTROY,
  SetEDIT,
} from "./../../../../../services/redux/slices/liability/assurances";
import Swal from "sweetalert2";
import { fullName } from "../../../../../services/utilities";

const Tables = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections, activePage, maxPage } = useSelector(
      ({ assurances }) => assurances
    ),
    dispatch = useDispatch();

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = collections.slice(startIndex, endIndex); // Get only

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
    <MDBTable responsive hover bordered className="text-center">
      <thead>
        <tr>
          <th>#</th>
          <th>Performer</th>
          <th>Lo</th>
          <th>Norm</th>
          <th>Hi</th>
          <th style={{ textAlign: "center", width: "19%" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {!paginatedData?.length ? (
          <tr>
            <td colSpan="6" className="text-center text-muted p-4">
              <strong>No data available</strong>
            </td>
          </tr>
        ) : (
          paginatedData.map((assurance, index) => (
            <tr key={index}>
              <td>
                {new Date(assurance?.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                })}
              </td>
              <td>{fullName(assurance?.userId?.fullName)}</td>
              <td>{assurance?.lo}</td>
              <td>{assurance?.norm}</td>
              <td>{assurance?.hi}</td>
              <td style={{ textAlign: "center" }}>
                <MDBBtnGroup>
                  <MDBBtn
                    size="sm"
                    rounded
                    color="success"
                    onClick={() => dispatch(SetEDIT(assurance))}
                    style={{ marginRight: "10px", borderRadius: "50px" }}
                  >
                    Edit
                  </MDBBtn>
                  <MDBBtn
                    size="sm"
                    rounded
                    color="danger"
                    onClick={() => handleDelete(assurance._id)}
                    style={{ borderRadius: "50px" }}
                  >
                    Delete
                  </MDBBtn>
                </MDBBtnGroup>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </MDBTable>
  );
};

export default Tables;
