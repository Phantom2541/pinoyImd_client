import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBIcon, MDBBtn, MDBBtnGroup, MDBBadge } from "mdbreact";
import { Input } from "../../../../../components/customizable";
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
    [selected, setSelected] = useState(null), // Initialize with null instead of -1
    [soloUpdate, setSoloUpdate] = useState(false),
    [key, setKey] = useState(""),
    dispatch = useDispatch();

  useEffect(() => {
    if (!formSubmitted && isSuccess) dispatch(RESET());
  }, [formSubmitted, isSuccess, dispatch]);

  const handleUpdate = () => {
    if (selected && selected.newAbbreviation !== selected.abbr) {
      const { _id } = selected;
      dispatch(
        UPDATE({
          token,
          data: { _id, [key]: selected[key] },
        })
      );
      setSoloUpdate(false);
    }
  };

  const handleEdit = (utilities) => {
    dispatch(SetSELECTED(utilities)); // Dispatch to redux
    setSelected(utilities); // Update the local selected state
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

  const handleChange = (utilities, key) => {
    setKey(key);
    setSelected({
      ...utilities,
      [`${key}OLD`]: utilities[key] || "", // Ensure it has a default value
      cutoff: utilities.cutoff || 1, // Default value for cutoff is 1 if not provided
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
          <th>Monthly CutOff</th>
          <th>Number</th>
          <th>Address</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData?.map((utilities, index) => {
          const { _id, displayname, cutoff, abbr, number, address } = utilities;
          return (
            <tr key={index}>
              <td>{index + startIndex + 1}</td>
              <td style={{ fontWeight: 400 }}>
                <div>{displayname}</div>
                <div
                  className="text"
                  onClick={() => handleChange(utilities, "abbr")} // Set selected to the full service object
                >
                  {selected?._id === _id && !showModal && soloUpdate ? (
                    // If this supplier is selected, show the input field for editing
                    <Input
                      formSubmitted={formSubmitted}
                      isSuccess={isSuccess}
                      _key={key}
                      value={selected.cutoff || 1}
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
              <td>{cutoff}</td>
              <td>{number} </td>
              <td>{address}</td>
              <td className="text-center">
                <MDBBtnGroup>
                  <MDBBtn
                    size="sm"
                    rounded
                    color="primary"
                    onClick={() => handleEdit(utilities)} // Ensure setSelected is used
                  >
                    <MDBIcon icon="pencil-alt" />
                  </MDBBtn>
                  <MDBBtn
                    onClick={() => handleDelete(utilities._id)}
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
