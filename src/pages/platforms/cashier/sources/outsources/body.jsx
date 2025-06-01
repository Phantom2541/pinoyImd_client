import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBIcon, MDBBtn, MDBBtnGroup } from "mdbreact";
import {
  billingAddress,
  currency,
  fullName,
} from "../../../../../services/utilities";
import Swal from "sweetalert2";
import {
  SetSELECTED,
  DESTROY,
  RESET,
} from "../../../../../services/redux/slices/assets/providers";
import { capitalize } from "lodash";

const Body = () => {
  const { token } = useSelector(({ auth }) => auth),
    { filtered, activePage, maxPage, isSuccess, formSubmitted } = useSelector(
      ({ providers }) => providers
    ),
    [selected, setSelected] = useState(-1),
    dispatch = useDispatch();

  useEffect(() => {
    if (!formSubmitted && isSuccess) dispatch(RESET());
  }, [formSubmitted, isSuccess, dispatch]);

  const handleEdit = (provider) => {
    console.log(selected);

    dispatch(SetSELECTED(provider));
    setSelected(provider);
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

  const itemsPerPage = maxPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered?.slice(startIndex, endIndex);

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Company</th>
          <th>Branch</th>
          <th>Address</th>
          <th>Credit</th>
          <th>Cutoff</th>
          <th>Status</th>
          <th colSpan="2">Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((provider, index) => {
          const { vendors = {}, status = "", credit, cutoff } = provider,
            { displayname, address, companyId } = vendors;
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{companyId?.name}</td>
              <td>{displayname}</td>
              <td>{billingAddress(address)}</td>
              <td>{currency(credit)}</td>
              <td>{cutoff || "-"}</td>
              <td>{capitalize(status)}</td>
              <td className="text-center" style={{ width: "200px" }}>
                <MDBBtnGroup>
                  <MDBBtn
                    size="sm"
                    rounded
                    color="primary"
                    onClick={() => handleEdit(provider)}
                  >
                    <MDBIcon icon="pencil-alt" />
                  </MDBBtn>
                  <MDBBtn
                    onClick={() => handleDelete(provider._id)}
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
