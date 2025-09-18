import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBBtn } from "mdbreact";
import {
  DESTROY,
  SetEDIT,
  SetFILTER,
  RESET,
} from "../../../../../services/redux/slices/diagnostics/clinic/clinicMenus";
import Swal from "sweetalert2";

export default function Body() {
  const dispatch = useDispatch();
  const {
    filtered = [],
    activePage,
    maxPage,
    collections = [],
  } = useSelector(({ clinicMenus }) => clinicMenus);
  const { token } = useSelector(({ auth }) => auth);

  const itemsPerPage = maxPage || 10;
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedData = filtered?.slice(startIndex, startIndex + itemsPerPage);

  const handleDelete = (_id, abbreviation) => {
    Swal.fire({
      title: "Are you sure?",
      text: `${abbreviation} permanently delete the clinic menu.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(DESTROY({ token, data: { id: _id } }));
      }
    });
  };

  return (
    <MDBTable responsive hover bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>Professional Fee</th>
          <th>Service/Product</th>
          <th>Description</th>
          <th>SRP</th>
          <th>Discountable</th>
          <th>Doctor/Specialist</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {paginatedData.length > 0 ? (
          paginatedData.map((row, index) => {
            if (!row) return null;
            const {
              professionalFee,
              abbreviation,
              description,
              srp,
              discountable,
              doctor,
              _id,
            } = row || {};

            return (
              <tr key={index}>
                <td>{startIndex + index + 1}</td>
                <td>
                  {typeof professionalFee === "number"
                    ? `₱${professionalFee.toLocaleString()}`
                    : "-"}
                </td>
                <td>{abbreviation ?? "-"}</td>
                <td>{description ?? "-"}</td>
                <td>
                  {typeof srp === "number" ? `₱ ${srp.toLocaleString()}` : "-"}
                </td>
                <td>{Boolean(discountable) ? "Yes" : "No"}</td>
                <td>{doctor ?? "-"}</td>{" "}
                <td className="d-flex gap-2">
                  <MDBBtn
                    size="sm"
                    color="info"
                    onClick={() => dispatch(SetEDIT(row))}
                  >
                    Edit
                  </MDBBtn>
                  <MDBBtn
                    size="sm"
                    color="danger"
                    onClick={() => handleDelete(_id, abbreviation)}
                  >
                    Delete
                  </MDBBtn>
                </td>
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan="8" className="text-center">
              No clinic menus found. Click <strong>Add</strong> to create a
              menu.
            </td>
          </tr>
        )}
      </tbody>
    </MDBTable>
  );
}
