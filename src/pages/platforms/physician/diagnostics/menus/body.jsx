import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBBtn } from "mdbreact";
import {
  DESTROY,
  SetEDIT,
  SetFILTER,
} from "../../../../../services/redux/slices/diagnostics/clinic/clinicMenus";
import Swal from "sweetalert2";

export default function Body() {
  const dispatch = useDispatch();
  const {
    filtered = [],
    activePage,
    maxPage,
  } = useSelector(({ clinicMenus }) => clinicMenus);
  const { token } = useSelector(({ auth }) => auth);

  const itemsPerPage = maxPage || 10;
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (value) => {
    if (value == null || value === "") return "-";
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(value);
  };

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
        dispatch(DESTROY({ token, data: { id: _id } }))
          .unwrap()
          .then(() => {
            // Remove from redux filtered list
            dispatch(
              SetFILTER((prev) => prev.filter((item) => item._id !== _id))
            );

            Swal.fire(
              "Deleted!",
              "The clinic menu has been removed.",
              "success"
            );
          })
          .catch((err) => {
            Swal.fire("Error", err.message || "Failed to delete.", "error");
          });
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
            const {
              doctorFee,
              abbreviation,
              description,
              srp,
              discountable,
              doctor,
              _id,
            } = row;

            return (
              <tr key={_id || index}>
                <td>{startIndex + index + 1}</td>
                <td>{formatCurrency(doctorFee) || "-"}</td>
                <td>{abbreviation || "-"}</td>
                <td>{description || "-"}</td>
                <td>{formatCurrency(srp)}</td>
                <td>{discountable ? "Yes" : "No"}</td>
                <td>{doctor || "-"}</td>
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
