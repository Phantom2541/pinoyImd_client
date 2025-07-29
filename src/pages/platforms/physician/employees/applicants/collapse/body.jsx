import React, { useState } from "react";
import Swal from "sweetalert2";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from "mdbreact";

// Format with time (for interview schedule)
const formatDateTime = (dateStr) => {
  if (!dateStr) return "N/A";
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export default function Collapsable({ item }) {
  const [status, setStatus] = useState(item.status || "");

  const handleAccept = () => {
    setStatus("hired");
    Swal.fire({
      icon: "success",
      title: "Applicant is successfully hired.",
      showConfirmButton: false,
      timer: 1500,
      position: "center",
    });
    // TODO: dispatch to Redux if needed
  };

  const handleDeny = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to deny this application.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deny it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setStatus("denied");
        Swal.fire({
          icon: "info",
          title: "Application has been denied.",
          showConfirmButton: false,
          timer: 1500,
          position: "center",
        });
        // TODO: dispatch to Redux if needed
      }
    });
  };

  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          <th>Resume</th>
          <th>Documents</th>
          <th>Schedule</th>
          <th>Remarks/Notes</th>
          <th style={{ width: "1%", whiteSpace: "nowrap" }}>Actions</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td><h5>{item.frequency}</h5></td>
          <td><small>{item.decSS}</small></td>
          <td><small>{formatDateTime(item.createdAt)}</small></td>
          <td><small>{item.decSS}</small></td>
          <td className="text-nowrap">
            <MDBBtn size="sm" color="success" onClick={handleAccept}>
              <i className="fas fa-check" />
            </MDBBtn>{" "}
            <MDBBtn size="sm" color="danger" onClick={handleDeny}>
              <i className="fas fa-times" />
            </MDBBtn>
          </td>
        </tr>
        <tr>
          <td colSpan="5" className="text-right pr-3 text-muted">
            <strong>Status:</strong> {status || "pending"}
          </td>
        </tr>
      </MDBTableBody>
    </MDBTable>
  );
}
