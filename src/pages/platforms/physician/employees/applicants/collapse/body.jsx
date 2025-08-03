import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from "mdbreact";
import { UPDATE } from "../../../../../../services/redux/slices/assets/persons/applicants";

export default function Collapsable({ item }) {
  const dispatch = useDispatch();
  const { token } = useSelector(({ auth }) => auth);

  const [status, setStatus] = useState(item.status || "pending");
  const [remarks, setRemarks] = useState(item.remarks || "");
  const [interviewDate, setInterviewDate] = useState(() => {
    const date = new Date(item.createdAt);
    return date.toISOString().slice(0, 16);
  });

  const [editing, setEditing] = useState(false);
  const [tempDate, setTempDate] = useState(interviewDate);

  const autoSave = (newData = {}) => {
    dispatch(
      UPDATE({
        data: {
          _id: item._id,
          status,
          remarks,
          interviewDate,
          ...newData,
        },
        token,
      })
    );
  };

  useEffect(() => {
    autoSave();
  }, [status, remarks]);

  const handleSaveDate = () => {
    setInterviewDate(tempDate);
    setEditing(false);
    autoSave({ interviewDate: tempDate });
  };

  const handleCancelEdit = () => {
    setTempDate(interviewDate);
    setEditing(false);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          <th>Resume</th>
          <th>Documents</th>
          <th>Date of Interview</th>
          <th>Remarks / Status</th>
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
          <td>
            <select
              className="form-control"
              value={status}
              onChange={handleStatusChange}
            >
              <option value="pending">Pending</option>
              <option value="denied">Denied</option>
            </select>
            <textarea
              className="form-control mt-2"
              rows="2"
              placeholder="Optional remarks..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </td>
        </tr>
        <tr>
          <td colSpan="4" className="text-right pr-3 text-muted">
            <strong>Status:</strong> {status || "pending"}
          </td>
        </tr>
      </MDBTableBody>
    </MDBTable>
  );
}
