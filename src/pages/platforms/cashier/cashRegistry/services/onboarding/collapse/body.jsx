import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from "mdbreact";
import { Services } from "../../../../../../../services/fakeDb";

export default function Collapsable({ item }) {
  const { sendouts, source, createdAt } = item;
  function handleAcknowledgeAndProcess() {
    console.log(item);
  }

  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          <th>Sources</th>
          <th>Services</th>
          <th>Generated At</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <td>
            <h5>{source?.displayname}</h5>
          </td>
          <td>
            <small>
              {sendouts?.servicesId
                .map((id) => Services.getAbbr(id))
                .join(", ")}
            </small>
          </td>
          <td>
            {`${new Intl.DateTimeFormat("default", {
              month: "long",
              day: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(createdAt))} @ ${new Intl.DateTimeFormat(
              "default",
              { hour: "2-digit", minute: "2-digit" }
            ).format(new Date(createdAt))}`}
          </td>
        </tr>
      </MDBTableBody>
      <MDBBtn color="primary" onClick={() => handleAcknowledgeAndProcess()}>
        Acknowledge & Process
      </MDBBtn>
    </MDBTable>
  );
}
