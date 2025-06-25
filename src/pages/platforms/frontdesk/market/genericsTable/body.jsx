import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon, MDBTable } from "mdbreact";
import {
  SetEDIT,
  DESTROY,
} from "../../../../../services/redux/slices/market/generics";
import Swal from "sweetalert2";

const Body = () => {
  const { token } = useSelector(({ auth }) => auth);
  const { filtered, activePage, maxPage, isSuccess } = useSelector(
      ({ generics }) => generics
    ),
    dispatch = useDispatch();

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page

  const handleUpdate = (item) => {
    dispatch(SetEDIT(item));
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
      if (result.isConfirmed) dispatch(DESTROY({ token, data: { _id } }));
    });
  };
  return (
    <MDBTable responsive hover>
      <thead style={{ backgroundColor: "#", color: "black" }}>
        <tr>
          <th>#</th>
          <th>Generic Name</th>
          <th>Dosage Form</th>
          <th>Strength</th>
          <th>Route</th>
          <th>Drug Class</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((item, index) => {
          const { _id, name, dosageForm, strength, route, drugClass, status } =
            item;
          return (
            <tr key={_id}>
              <td>{index + startIndex + 1}</td>
              <td style={{ textTransform: "capitalize" }}>{name}</td>
              <td style={{ textTransform: "capitalize" }}>{dosageForm}</td>
              <td>{strength}</td>
              <td style={{ textTransform: "capitalize" }}>{route}</td>
              <td style={{ textTransform: "capitalize" }}>{drugClass}</td>
              <td style={{ textTransform: "capitalize" }}>{status}</td>
              <td>
                <button
                  onClick={() => handleUpdate(item)}
                  className="btn btn-primary"
                >
                  UPDATE
                </button>
                <button
                  onClick={() => handleDelete(_id)}
                  className="btn btn-danger"
                >
                  DELETE
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
