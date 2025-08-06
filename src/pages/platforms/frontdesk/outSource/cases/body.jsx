import React from "react";
import { MDBTable, MDBTableBody, MDBTableHead, MDBBadge } from "mdbreact";
import { useSelector } from "react-redux";
import { fullName } from "../../../../../services/utilities";

export default function CaseBody() {
  const { filtered } = useSelector((state) => state.cases);

  return (
    <MDBTable small bordered hover responsive>
      <MDBTableHead>
        <tr>
          <th>Patient #</th>
          <th>Patient Name</th>
          <th>Case #</th>
          <th>Title</th>
          <th>Remarks</th>
          <th>Status</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {filtered.map((item, index) => (
          <tr key={index}>
            <td>{item?.pId?.personnelNo || "—"}</td>
            <td>{item?.pId ? fullName(item.pId) : "—"}</td>
            <td>{item?.caseNumber || "—"}</td>
            <td>{item?.title || "—"}</td>
            <td>{item?.description || "—"}</td>
            <td>
              <MDBBadge color="info" pill className="text-capitalize">
                {item?.status || "active"}
              </MDBBadge>
            </td>
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
}
