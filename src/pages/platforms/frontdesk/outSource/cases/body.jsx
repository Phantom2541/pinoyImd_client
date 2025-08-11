import React, { useState } from "react";
import {
  MDBTable,
  MDBTableBody,
  MDBTableHead,
  MDBBadge,
  MDBBtn,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
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
          <th style={{ width: "5%" }}></th>
          <th style={{ width: "20%" }}>Patient Name</th>
          <th style={{ width: "15%" }}>Case #</th>
          <th style={{ width: "25%" }}>Title</th>
          <th style={{ width: "20%" }}>Tags</th>
          <th style={{ width: "15%", textAlign: "center" }}>Status</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {filtered.map((item, index) => {
          const patient = item?.pId || {};
          const ap = item?.ap?.[0] || {};

          return (
            <React.Fragment key={item._id || index}>
              {/* Main Row */}
              <tr>
                <td
                  onClick={() => toggleCollapse(index)}
                  style={{ cursor: "pointer", textAlign: "center" }}
                >
                  <i
                    className={`fas fa-${openRow === index ? "minus" : "plus"}`}
                    style={{
                      fontSize: "0.75rem",
                      color: openRow === index ? "red" : "green",
                    }}
                  />
                </td>
                <td>{patient?.fullName ? fullName(patient.fullName) : "—"}</td>
                <td>{item.caseNumber || "—"}</td>
                <td>{item.title || "—"}</td>
                <td>{item.tags || "—"}</td>
                <td className="d-flex justify-content-center align-items-center h-100">
                  <MDBBadge
                    color="success"
                    pill
                    className="px-2 py-1"
                    style={{ fontSize: "0.7rem" }}
                  >
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
                          <th style={{ width: "5%" }}></th> {/* Invisible */}
                          <th style={{ width: "20%" }}>Assigned At</th>
                          <th style={{ width: "15%" }}>Notes</th>
                          <th style={{ width: "25%" }}>Description</th>
                          <th style={{ width: "20%" }}>Remarks</th>
                          <th style={{ width: "15%", textAlign: "center" }}>Action</th>
                        </tr>
                      </MDBTableHead>
                      <MDBTableBody>
                        <tr>
                          <td></td> 
                          <td>{ap.assignedAt ? new Date(ap.assignedAt).toLocaleString() : "—"}</td>
                          <td>{ap.notes || "—"}</td>
                          <td>{item.description || "—"}</td>
                          <td>{item.remarks || "—"}</td>
                          <td style={{ textAlign: "center" }}>
                            <MDBBtn
                              color="danger"
                              size="sm"
                              className="px-2 py-1"
                              onClick={() => handleDelete(item._id)}
                            >
                              <i className="fas fa-trash-alt" style={{ fontSize: "0.75rem" }} />
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