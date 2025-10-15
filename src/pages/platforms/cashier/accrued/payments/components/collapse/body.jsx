import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { Statements } from "../../../../../../../services/fakeDb";
import {
  currency,
  dateFormat,
  // fullName,
} from "../../../../../../../services/utilities";
import util from "../../../payables/util";

export default function Collapsable({ deals = [] }) {
  return (
    <MDBTable bordered className="m-0 p-0">
      <MDBTableHead>
        <tr>
          <th>Payee</th>
          <th>Statements</th>
          <th>Amount</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {deals?.map((deal, index) => {
          const {
            payableId,
            amount,
            fsId,
            remarks,
            createdAt,
            category,
            particular: par,
            supplier: supp,
            breakdown,
          } = deal;

          const particular = payableId?.particular || par;
          const supplier = payableId?.supplier || supp;
          const baseAmount = fsId === 13 ? breakdown?.net : amount;
          return (
            <tr key={index}>
              <td>
                <h6>{util.getVendorOrParticular(particular, supplier)}</h6>
              </td>
              <td>
                <h6>
                  {Statements.getName(fsId)}- {dateFormat(createdAt)}
                </h6>
                <small>Category :{category}</small>
              </td>
              <td>
                <h6>{currency.format(baseAmount)}</h6>
                <small>Remarks : {remarks}</small>
              </td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}
