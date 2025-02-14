import React, { useState, useEffect } from "react";
import Header from "./header";
import { MDBTable } from "mdbreact";
// import { Services } from "../../services/fakeDb";

export default function Drugtest({ sale }) {
  console.log("sale", sale);

  // const {
  //   category,
  //   branchId,
  //   patient,
  //   updatedAt,
  //   source,
  //   referral,
  //   form,
  //   remarks,
  //   signatories,
  // } = task;
  const { updatedAt, customerId, referral, category, cart = [] } = sale;
  return (
    <>
      <Header />
      <MDBTable responsive borderless className="mb-0 thermal-font">
        <thead>
          <tr>
            <th colSpan={2} className="py-0" style={{ fontSize: "17.5px" }}>
              Drug/Metabolite
            </th>
            <th>Result</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </MDBTable>
    </>
  );
}
