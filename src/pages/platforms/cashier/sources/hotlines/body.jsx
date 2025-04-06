import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBBtn, MDBBtnGroup, MDBIcon, MDBTable, MDBBadge } from "mdbreact";
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
    [selected, setSelected] = useState(-1),
    dispatch = useDispatch();

  const handleEdit = (service) => {
    dispatch(SetSELECTED(service));
    setSelected(service);
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
          <th className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((service, index) => {
          const { _id, abbr, displayname, number, address } = service;
          return (
            <tr key={index}>
              <td key={index}>{index + startIndex + 1}</td>
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
                  >
                    {abbr}
                  </MDBBadge>
                )}
              </td>
              <td>{number} </td>
              <td>{address}</td>
              <td className="text-center">
                <MDBBtnGroup>
                  <MDBBtn
                    size="sm"
                    rounded
                    color="primary"
                    onClick={() => handleEdit(service)}
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
