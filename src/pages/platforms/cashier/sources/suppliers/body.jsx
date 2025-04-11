import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBIcon, MDBBtn, MDBBtnGroup, MDBBadge } from "mdbreact";
// import { Input } from "../../../../../components/customizable";

import {
  SetSELECTED,
  DESTROY,
  RESET,
  UPDATE,
} from "../../../../../services/redux/slices/assets/providers";
import Swal from "sweetalert2";
import { Input } from "../../../../../components/customizable";

const Body = () => {
  const { token } = useSelector(({ auth }) => auth),
    { filtered, activePage, maxPage, formSubmitted, isSuccess, showModal } =
      useSelector(({ providers }) => providers),
    [selected, setSelected] = useState(null), // Start with null instead of -1
    [soloUpdate, setSoloUpdate] = useState(false),
    dispatch = useDispatch();

  useEffect(() => {
    if (!formSubmitted && isSuccess) dispatch(RESET());
  }, [formSubmitted, isSuccess, dispatch]);

  const handleEdit = (supplier) => {
    dispatch(SetSELECTED(supplier));
    setSelected(supplier);
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

  const handleUpdate = () => {
    if (selected && selected.newAbbreviation !== selected.abbr) {
      const { _id, abbr } = selected;
      dispatch(
        UPDATE({
          token,
          data: { _id, abbr },
        })
      );
    }
  };

  const handleChange = (supplier) => {
    setSelected({
      ...supplier,
      abbrOld: supplier?.abbr || "", // Ensure it has a default value
    });
    setSoloUpdate(true);
  };

  const handleAbbreviationChange = (key, value) =>
    setSelected({ ...selected, [key]: value });

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
          <th>Membership</th>
          <th>Number</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((supplier, index) => {
          const { _id, displayname, name, abbr, number, address, membership } =
            supplier;

          return (
            <tr key={_id}>
              <td>{index + startIndex + 1}</td>
              <td style={{ fontWeight: 400 }}>
                <div>{displayname || name}</div>

                <div
                  className="text-muted"
                  onClick={() => handleChange(supplier)} // Set selected to the full service object
                >
                  {selected?._id === _id && !showModal && soloUpdate ? (
                    // If this supplier is selected, show the input field for editing
                    <Input
                      formSubmitted={formSubmitted}
                      isSuccess={isSuccess}
                      _key="abbr"
                      selected={selected}
                      onChange={handleAbbreviationChange} // Handle input change
                      handleCheck={handleUpdate} // Trigger update when editing is finished
                    />
                  ) : abbr != null && abbr !== "" ? (
                    // If not editing, show the abbreviation as a badge
                    <MDBBadge
                      title="Click me to update"
                      className="cursor-pointer"
                    >
                      {abbr}
                    </MDBBadge>
                  ) : (
                    <p className="mb-0">No abbreviation</p>
                  )}
                </div>
              </td>
              <td>{membership}</td>
              <td>{number}</td>
              <td>{address}</td>
              <td className="text-center">
                <MDBBtnGroup>
                  <MDBBtn
                    size="sm"
                    rounded
                    color="primary"
                    onClick={() => handleEdit(supplier)}
                  >
                    <MDBIcon icon="pencil-alt" />
                  </MDBBtn>
                  <MDBBtn
                    onClick={() => handleDelete(supplier._id)}
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
