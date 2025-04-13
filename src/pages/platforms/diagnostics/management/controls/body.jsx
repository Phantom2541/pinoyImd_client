import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBCardBody } from "mdbreact";
import {
  DESTROY,
  SetEDIT,
} from "../../../../../services/redux/slices/diagnostics/management/controls";
import Swal from "sweetalert2";

const Tables = () => {
  const { token } = useSelector(({ auth }) => auth);
  const { filtered, activePage, maxPage } = useSelector(
      ({ controls }) => controls
    ),
    dispatch = useDispatch(),
    [hoveredRow, setHoveredRow] = useState(null); // Track hovered row index

  console.log("Tables filtered", filtered);

  /**
   * Pagination: Calculate the start and end index for the current page
   */
  const itemsPerPage = maxPage; // Number of items per page
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filtered.slice(startIndex, endIndex); // Get only items for the active page

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
    <MDBCardBody>
      <MDBTable responsive hover bordered className="table-sm">
        <thead className="table-light">
          <tr>
            <th className="text-center px-2 py-1">#</th>
            <th className="text-center px-2 py-1">Lo</th>
            <th className="text-center px-2 py-1">Normal</th>
            <th className="text-center px-2 py-1">Hi</th>
          </tr>
        </thead>
        <tbody>
          {!paginatedData?.length && (
            <tr>
              <td colSpan={4} className="text-center">
                No data found
              </td>
            </tr>
          )}
          {paginatedData?.map((control, index) => (
            <tr
              key={index}
              onMouseEnter={() => setHoveredRow(index)}
              onMouseLeave={() => setHoveredRow(null)}
              className={hoveredRow === index ? "table-danger text-white" : ""}
            >
              <td
                className={`text-center align-middle ${
                  hoveredRow === index ? "bg-danger text-white" : ""
                }`}
              >
                {new Date(control?.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                })}
              </td>

              {hoveredRow === index ? (
                <td colSpan={3} className="text-center bg-danger text-white">
                  <button
                    onClick={() => dispatch(SetEDIT(control))}
                    className="btn btn-light btn-sm me-2"
                  >
                    <span
                      role="img"
                      aria-label="edit emoji"
                      aria-labelledby="edit-emoji"
                    >
                      ✏️{" "}
                    </span>{" "}
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(control._id)}
                    className="btn btn-light btn-sm"
                  >
                    <span
                      role="img"
                      aria-label="delete emoji"
                      aria-labelledby="delete-emoji"
                    >
                      🗑️{" "}
                    </span>
                    Delete
                  </button>
                </td>
              ) : (
                <>
                  <td className="text-center align-middle">{control?.lo}</td>
                  <td className="text-center align-middle">{control?.norm}</td>
                  <td className="text-center align-middle">{control?.hi}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </MDBTable>
    </MDBCardBody>
  );
};

export default Tables;
