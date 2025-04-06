import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBIcon, MDBBtn, MDBBtnGroup, MDBBadge } from "mdbreact";
import { Input } from "../../../../../components/customizable";
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
    [selected, setSelected] = useState(null), // Initialize with null instead of -1
    dispatch = useDispatch();

  const handleEdit = (service) => {
    dispatch(SetSELECTED(service)); // Dispatch to redux
    setSelected(service); // Update the local selected state
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
          <th>Cut Off</th>
          <th>Number</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((service, index) => {
          const { _id, displayname, cutoff, abbr, number, address } = service;
          return (
            <tr key={index}>
              <td>{index + startIndex + 1}</td>
              <td style={{ fontWeight: 400 }}>
                <div>{displayname}</div>
                {_id === selected?._id ? (
                  <div style={{ width: "13rem" }}>
                    <Input className="mt-2 form-control form-control-sm" />
                  </div>
                ) : (
                  <MDBBadge
                    title="Click me to update"
                    className="cursor-pointer"
                    onClick={() => handleEdit(service)} // Update selected when clicked
                  >
                    {abbr}
                  </MDBBadge>
                )}
              </td>
              <td>{cutoff}</td>
              <td>{number} </td>
              <td>{address}</td>
              <td className="text-center">
                <MDBBtnGroup>
                  <MDBBtn
                    size="sm"
                    rounded
                    color="primary"
                    onClick={() => handleEdit(service)} // Ensure setSelected is used
                  >
                    <MDBIcon icon="pencil-alt" />
                  </MDBBtn>
                  <MDBBtn
                    onClick={() => handleDelete(service._id)}
                    size="sm"
                    rounded
                    color="danger"
                  >
                    <MDBIcon icon="trash" />
                  </MDBBtn>
                </MDBBtnGroup>
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
};

export default Body;
