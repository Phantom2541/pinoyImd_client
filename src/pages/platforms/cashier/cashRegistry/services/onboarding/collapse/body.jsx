import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from "mdbreact";
import { Services } from "../../../../../../../services/fakeDb";
import { useSelector } from "react-redux";

export default function Collapsable({ item }) {
  const { auth, token } = useSelector((auth) => auth),
    { sendouts, source, createdAt } = item;
  function handleAcknowledgeAndProcess() {
    const UpdateData = {
      token,
      data: {
        _id: item._id,
        acknowledged: {
          by: auth._id,
          at: new Date(),
        },
      },
    };

    const SaveData = {
      token,
      data: {
        dealId: item._id,
        menuId: {
          $in: sendouts.servicesId, // sendouts?.servicesId ??
        },
        up: 0, //?
        discount: 0, //?
      },
    };

    console.log(UpdateData);
    console.log(SaveData);
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
            }).format(new Date(createdAt))}`}
          </td>
        </tr>
      </MDBTableBody>
      <MDBBtn color="primary" onClick={() => handleAcknowledgeAndProcess()}>
        Acknowledge & Process
      </MDBBtn>
    </MDBTable>
  );
}
