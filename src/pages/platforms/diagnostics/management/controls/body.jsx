import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable } from "mdbreact";
import {
  DESTROY,
  SetEDIT,
} from "./../../../../../services/redux/slices/liability/controls";
import Swal from "sweetalert2";

const Tables = () => {
  const { token } = useSelector(({ auth }) => auth),
    { collections, activePage, maxPage } = useSelector(
      ({ controls }) => controls
    ),
    dispatch = useDispatch();

  const [hoveredRow, setHoveredRow] = useState(null); // Track hovered row index

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = collections.slice(startIndex, endIndex); // Get only items for the active page

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
    <MDBTable responsive hover bordered style={{ minHeight: "300px" }}>
      <thead>
        <tr>
          <th>#</th>
          <th>Lo</th>
          <th>Normal</th>
          <th>Hi</th>
        </tr>
      </thead>
      <tbody>
        {!paginatedData?.length && (
          <tr>
            <td colSpan={4} style={{ textAlign: "center" }}>
              No data found
            </td>
          </tr>
        )}
        {paginatedData?.map((control, index) => (
          <tr
            key={index}
            onMouseEnter={() => setHoveredRow(index)}
            onMouseLeave={() => setHoveredRow(null)}
            style={{
              backgroundColor: hoveredRow === index ? "#ff4d4d" : "transparent", // Instant red background on hover
              color: hoveredRow === index ? "white" : "inherit", // White text for contrast
            }}
          >
            {/* Always show the Date column */}
            <td>
              {new Date(control?.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
              })}
            </td>

            {/* Hovered row with Edit/Delete buttons */}
            {hoveredRow === index ? (
              <td
                colSpan={3}
                style={{ textAlign: "center", backgroundColor: "#ff4d4d" }}
              >
                <button
                  onClick={() => dispatch(SetEDIT(control))}
                  style={{ marginRight: "10px", padding: "5px 10px" }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(control._id)}
                  style={{ color: "red", padding: "5px 10px" }}
                >
                  🗑️ Delete
                </button>
              </td>
            ) : (
              // Default row (normal display)
              <>
                <td>{control?.lo}</td>
                <td>{control?.norm}</td>
                <td>{control?.hi}</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </MDBTable>
  );
};

export default Tables;
