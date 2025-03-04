import React from "react";
import { MDBTable } from "mdbreact";

export default function CollapseTable({ id, service }) {
  return (
    <MDBTable responsive hover className="text-center">
      <thead>
        <tr>
          <th>#</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr key={`frequency-${id}`}>
          <td>Frequency</td>
          <td>{service["frequency"]}</td>
        </tr>
        <tr key={`preparation-${id}`}>
          <td>Preparation</td>
          <td>{service?.preparation}</td>
        </tr>
        <tr key={`specimen-${id}`}>
          <td>Specimen</td>
          <td>{service?.specimen}</td>
        </tr>
        <tr key={`preference-${id}`}>
          <td>Preference</td>
          <td>{service?.preference}</td>
        </tr>
      </tbody>
    </MDBTable>
  );
}
