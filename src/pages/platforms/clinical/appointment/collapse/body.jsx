import React from "react";
import {
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBIcon,
} from "mdbreact";
import { fullName } from "../../../../../services/utilities";
import { capitalize } from "lodash";

export default function CollapsableBody({ item }) {
  const { patients = [] } = item;

  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          <th>No.</th>
          <th>Patient</th>
          <th className="text-center">Laboratory</th>
          <th className="text-center">Radiology</th>
          <th>Remarks</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {patients.map((p, index) => {
          const { patient, number, remarks, status, hasLab, hasRadiology } = p;
          return (
            <tr key={index}>
              <td>{number}</td>
              <td>
                {fullName(patient?.fullName)}{" "}
                <MDBBadge
                  color={status === "confirmed" ? "success" : "info"}
                  className="ml-2"
                >
                  {capitalize(status)}
                </MDBBadge>
              </td>
              <td className="text-center">
                <MDBIcon
                  size="lg"
                  icon={hasLab ? "check" : "times"}
                  style={{
                    color: hasLab ? "green" : "black",
                  }}
                />
              </td>
              <td className="text-center">
                <MDBIcon
                  size="lg"
                  icon={hasRadiology ? "check" : "times"}
                  style={{
                    color: hasRadiology ? "green" : "black",
                  }}
                />
              </td>
              <td>{remarks}</td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
