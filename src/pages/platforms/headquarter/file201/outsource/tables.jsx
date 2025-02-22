import React, { useState } from "react";
import { MDBTable, MDBIcon, MDBBtnGroup, MDBBtn } from "mdbreact";
import { DESTROY } from "../../../../../services/redux/slices/assets/providers";
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
  const { token, maxPage } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();

  // Trigger for update
  const handleUpdate = (vendor) => {
    setSelected(vendor);
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
          <th rowSpan={2}>Company</th>
          <th rowSpan={2}>Branch</th>
          <th colSpan={2} className="text-center">
            Contact Person
          </th>
          <th rowSpan={2}>Address</th>
          <th className="text-center " rowSpan={2}>
            Action
          </th>
        </tr>
        <tr>
          <th>Mobile</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {handlePagination(vendors, page, maxPage)?.map((vendor, index) => {
          const { vendors, name, subName } = vendor;

          return (
            <tr key={index}>
              <td>{vendor?.vendors?.companyName}</td>
              <td>{vendor?.vendors.name}</td>
              <td>{vendor?.vendors?.contacts?.mobile}</td>
              <td>{vendor?.vendors?.contacts?.mobile}</td>
              <td>{vendor?.vendors?.address?.city}</td>
              <td className="py-2 text-center">
                <MDBBtnGroup>
                  <MDBBtn
                    className="m-0"
                    size="sm"
                    color="info"
                    rounded
                    title="Update"
                    onClick={() => handleUpdate(vendor)}
                  >
                    <MDBIcon icon="pen" />
                  </MDBBtn>
                  <MDBBtn
                    className="m-0"
                    size="sm"
                    rounded
                    color="danger"
                    title="Delete"
                    onClick={() => handleDelete(vendor)}
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
