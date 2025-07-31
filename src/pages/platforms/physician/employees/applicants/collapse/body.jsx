import React, { useState } from "react";
import Swal from "sweetalert2";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from "mdbreact";

export default function Collapsable({ item }) {
  const [status, setStatus] = useState(item.status || "");
  const [interviewDate, setInterviewDate] = useState(() => {
    const date = new Date(item.createdAt);
    return date.toISOString().slice(0, 16);
  });
  const [editing, setEditing] = useState(false);
  const [tempDate, setTempDate] = useState(interviewDate);

  const handleAccept = () => {
    setStatus("hired");
    Swal.fire({
      icon: "success",
      title: "Applicant is successfully hired.",
      showConfirmButton: false,
      timer: 1500,
      position: "center",
    });
  };

  const handleDeny = () => {
    Swal.fire({
      title: "What do you want to do with this application?",
      icon: "question",
      showConfirmButton: false,
      showCancelButton: false,
      html: `
        <button id="denyBtn" class="swal2-confirm swal2-styled" style="background-color: #e74c3c; margin-right: 10px;">Deny</button>
        <button id="pendingBtn" class="swal2-confirm swal2-styled" style="background-color: #f39c12; margin-right: 10px;">Put to Pending Queue</button>
        <button id="cancelBtn" class="swal2-cancel swal2-styled">Cancel</button>
      `,
      didOpen: () => {
        const swal = Swal.getPopup();

        swal.querySelector("#denyBtn").addEventListener("click", () => {
          setStatus("denied");
          Swal.fire("Denied!", "Application was denied.", "success");
        });

        swal.querySelector("#pendingBtn").addEventListener("click", () => {
          setStatus("pending");
          Swal.fire("Pending!", "Moved to pending queue.", "info");
        });

        swal.querySelector("#cancelBtn").addEventListener("click", () => {
          Swal.close();
        });
      },
    });
  };

  const handleSaveDate = () => {
    setInterviewDate(tempDate);
    setEditing(false);
    Swal.fire({
      icon: "success",
      title: "Interview date updated.",
      timer: 1200,
      showConfirmButton: false,
    });
  };

  const handleCancelEdit = () => {
    setTempDate(interviewDate);
    setEditing(false);
  };

  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          <th>Resume</th>
          <th>Documents</th>
          <th>Date of Interview</th>
          <th>Remarks/Notes</th>
          <th style={{ width: "1%", whiteSpace: "nowrap" }}>Actions</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td><h5>{item.frequency}</h5></td>
          <td><small>{item.decSS}</small></td>
          <td>
            {editing ? (
              <>
                <input
                  type="datetime-local"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  className="form-control mb-2"
                  style={{ maxWidth: "220px" }}
                />
                <div>
                  <MDBBtn size="sm" color="primary" onClick={handleSaveDate}>
                    Save
                  </MDBBtn>{" "}
                  <MDBBtn size="sm" color="secondary" onClick={handleCancelEdit}>
                    Cancel
                  </MDBBtn>
                </div>
              </>
            ) : (
              <>
                <small>
                  {new Date(interviewDate).toLocaleString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </small>
                <br />
                <MDBBtn
                  size="sm"
                  color="warning"
                  onClick={() => setEditing(true)}
                  className="mt-1"
                >
                  Edit
                </MDBBtn>
              </>
            )}
          </td>
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
