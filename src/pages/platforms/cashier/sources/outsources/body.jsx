import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBIcon, MDBBtn, MDBBtnGroup } from "mdbreact";
import { billingAddress, fullName } from "../../../../../services/utilities";
import Swal from "sweetalert2";
import {
  SetSELECTED,
  DESTROY,
  RESET,
  UPDATE,
} from "../../../../../services/redux/slices/assets/providers";

const Body = () => {
  const { token } = useSelector(({ auth }) => auth),
    { filtered, activePage, maxPage, isSuccess, formSubmitted, showModal } =
      useSelector(({ providers }) => providers),
    [soloUpdate, SetSoloUpdate] = useState(false),
    [selected, setSelected] = useState(-1),
    dispatch = useDispatch();

  useEffect(() => {
    if (!formSubmitted && isSuccess) dispatch(RESET());
  }, [formSubmitted, isSuccess, dispatch]);

  const handleEdit = (provider) => {
    dispatch(SetSELECTED(provider));
    setSelected(provider);
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

  const handleChange = (provider) => {
    setSelected({
      ...provider,
      abbrOld: provider?.abbr || "", // Ensure it has a default value
    });
    // setSoloUpdate(true);
  };

  const handleAbbreviationChange = (key, value) =>
    setSelected({ ...selected, [key]: value });
  /**
   * Pagination: Calculate the start and end index for the current page
   */

  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered?.slice(startIndex, endIndex); // Get only items for the active page

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr className="text-center">
          <th>#</th>
          <th>Name</th>
          <th>A.O.</th>
          <th>Membership</th>
          <th>Address</th>
          <th colSpan="4">Action</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((provider, index) => {
          const { vendors = {}, membership, ao } = provider,
            { displayname, address } = vendors;
          return (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{displayname}</td>
              <td>{fullName(ao?.fullName)}</td>
              <td>{membership}</td>
              <td>{billingAddress(address)}</td>

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
