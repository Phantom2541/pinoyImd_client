import React, { useState } from "react";
import { MDBTable, MDBIcon, MDBBtnGroup, MDBBtn } from "mdbreact";
import { DESTROY } from "../../../../../services/redux/slices/assets/persons/source";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { handlePagination } from "../../../../../services/utilities";

const Tables = ({
  vendors,
  setSelected,
  setWillCreate,
  setShowModal,
  page,
}) => {
  // Rest of your code here

  const { token, maxPage, auth } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  //Trigger for update
  const handleUpdate = (selected) => {
    setSelected(selected);
    setWillCreate(false);
    setShowModal(true);
  };

  const handleDelete = ({ _id }) => {
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
          <th className="th-lg cursor-pointer" rowSpan={2}>
            No&nbsp;
            <MDBIcon
              icon="sort"
              title="Sort by Name"
              className="text-primary"
            />
          </th>
          <th rowSpan={2}>Company Name</th>
          <th rowSpan={2}>Branch Name</th>
          <th colSpan={2} className="text-center">
            Contact
          </th>
          <th rowSpan={2}>Address</th>
          <th className="text-center " rowSpan={2}>
            {" "}
            Action
          </th>
        </tr>
        <tr>
          <th>Contact Person</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {handlePagination(vendors, page, maxPage)?.map((vendor, index) => {
          const { clients, address } = vendor;
          // Rest of your code here

          return (
            <tr key={index}>
              <td>{index + 1}.</td>
              <td>{clients?.companyName}</td>
              <td>{clients?.name}</td>
              <td>{clients?.contacts?.mobile}</td>
              <td>{clients?.contacts?.email}</td>
              <td>{clients?.address?.city}</td>
              <td className="py-2 text-center">
                <MDBBtnGroup>
                  <MDBBtn
                    className="m-0"
                    size="sm"
                    color="info"
                    rounded
                    title="Update"
                    onClick={() => {
                      handleUpdate(vendors);
                    }}
                  >
                    <MDBIcon icon="pen" />
                  </MDBBtn>
                  <MDBBtn
                    className="m-0"
                    size="sm"
                    rounded
                    color="danger"
                    title="Delete"
                    onClick={() => handleDelete(vendors)}
                  >
                    <MDBIcon icon="trash-alt" />
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
export default Tables;
