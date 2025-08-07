import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { properFullname } from "../../../../../../services/utilities";

export default function Collapsable({ item }) {
  const {
    ppId,
    source,
    rfv,
    remarks,
    case: cases,
    admittedAt,
    assistants,
    eId,
    attachments,
  } = item;

  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          <th>Primary Physician</th>
          <th>Source</th>
          <th>Reason For Visit</th>
          <th>Case</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td>{properFullname(ppId?.fullName || "N/A")}</td>
          <td>{source}</td>
          <td>{rfv}</td>
          <td>{cases?.name || "N/A"}</td>
        </tr>
        <tr>
          <th>Admitted</th>
          <th>Assistants</th>
          <th>Encoder</th>
          <th>Remarks</th>
        </tr>
        <tr>
          <td>{new Date(admittedAt).toLocaleString()}</td>
          <td>
            {assistants?.length > 0 ? (
              <ul className="m-0 p-0">
                {assistants.map((asst, i) => (
                  <div key={i}>
                    {asst?.userId?.fullName || "N/A"} – {asst.role} (
                    {asst.specialization})<div>Remarks: {asst.remarks}</div>
                  </div>
                ))}
              </ul>
            ) : (
              "None"
            )}
          </td>
          <td>
            {eId.fullName?.title}
            {properFullname(eId?.fullName || "N/A")}
          </td>
          <td>{remarks}</td>
        </tr>
        <tr>
          <th colSpan={4}>Attachments</th>
        </tr>
        <tr>
          <td colSpan={4}>
            {attachments?.length > 0 ? (
              <ul className="m-0 p-0">
                {attachments.map((att, i) => (
                  <li key={i}>
                    <a href={att.url} target="_blank" rel="noopener noreferrer">
                      {att.filename || att.type}
                    </a>{" "}
                    – {att.remarks}
                  </li>
                ))}
              </ul>
            ) : (
              "No attachments"
            )}
          </td>
        </tr>
      </MDBTableBody>
    </MDBTable>
  );
}
