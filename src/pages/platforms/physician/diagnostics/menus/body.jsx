import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTable, MDBBtn } from "mdbreact";
import {
  toggleModal,
  DESTROY,
} from "../../../../../services/redux/slices/diagnostics/clinic/clinicMenus";

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
          paginatedData.map((row, index) => (
            <tr key={row._id || index}>
              <td>{startIndex + index + 1}</td>
              <td>{formatCurrency(row.doctorFee)}</td>
              <td>{row.service || "-"}</td>
              <td>{row.description || "-"}</td>
              <td>{formatCurrency(row.srp)}</td>
              <td>{row.discountable ? "Yes" : "No"}</td>
              <td>{row.doctor || "-"}</td>
              <td className="d-flex gap-2">
                <MDBBtn
                  size="sm"
                  color="info"
                  onClick={() =>
                    dispatch(
                      toggleModal({
                        selected: row,
                        willCreate: false,
                        showModal: true,
                      })
                    )
                  }
                >
                  Edit
                </MDBBtn>
                <MDBBtn
                  size="sm"
                  color="danger"
                  onClick={() => dispatch(DESTROY({ id: row._id, token }))}>
                  Delete
                </MDBBtn>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center">
              No clinic menus found. Click <strong>Add</strong> to create a menu.
            </td>
          </tr>
        )}
      </tbody>
    </MDBTable>
  );
}
