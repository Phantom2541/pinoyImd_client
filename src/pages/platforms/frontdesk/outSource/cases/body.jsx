import React, { useState } from "react";
import { MDBTable, MDBTableBody, MDBTableHead, MDBBadge, MDBBtn } from "mdbreact";
import { useSelector, useDispatch } from "react-redux";
import { DESTROY } from "../../../../../services/redux/slices/commerce/pos/services/cases";
import { fullName } from "../../../../../services/utilities";

export default function CaseBody() {
  const dispatch = useDispatch();
  const { filtered } = useSelector((state) => state.cases);
  const [openRow, setOpenRow] = useState(null);

  const toggleCollapse = (index) => {
    setOpenRow(openRow === index ? null : index);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this case?")) {
      dispatch(DESTROY({ id, token: "" }));
    }
  };

  return (
    <MDBTable small bordered hover responsive>
      <MDBTableHead>
        <tr>
          <th></th>
          <th>Patient Name</th>
          <th>Case #</th>
          <th>Title</th>
          <th>Remarks</th>
          <th>Status</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {filtered.map((item, index) => {
          const patient = item?.pId || {};
          const ap = item?.ap?.[0] || {};

          return (
            <React.Fragment key={item._id || index}>
              <tr>
                <td
                  onClick={() => toggleCollapse(index)}
                  style={{ cursor: "pointer", width: "30px", textAlign: "center" }}
                >
                  <i
                    className={`fas fa-${openRow === index ? "minus" : "plus"}`}
                    style={{
                      color: openRow === index ? "red" : "green",
                      fontSize: "1rem",
                    }}
                  />
                </td>
                <td>{patient?.fullName ? fullName(patient.fullName) : "—"}</td>
                <td>{item.caseNumber || "—"}</td>
                <td>{item.title || "—"}</td>
                <td>{item.remarks || "—"}</td>
                <td>
                  <MDBBadge color="info" pill className="text-capitalize">
                    {item.status || "active"}
                  </MDBBadge>
                </td>
              </tr>

              {openRow === index && (
                <tr>
                  <td colSpan="6" className="bg-light p-2">
                    <MDBTable small borderless className="mb-0">
                      <MDBTableHead>
                        <tr>
                          <th>Assigned At</th>
                          <th>Notes</th>
                          <th>Description</th>
                          <th>Action</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        <tr>
                          <td>{ap.assignedAt ? new Date(ap.assignedAt).toLocaleString() : "—"}</td>
                          <td>{ap.notes || "—"}</td>
                          <td>{item.description || "—"}</td>
                          <td>
                            <MDBBtn color="danger" size="sm" onClick={() => handleDelete(item._id)}>
                              <i className="fas fa-trash-alt" /> Delete
                            </MDBBtn>
                          </td>
                        </tr>
                      </MDBTableBody>
                    </MDBTable>
                  </td>
                </tr>
              )}
            </React.Fragment>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
