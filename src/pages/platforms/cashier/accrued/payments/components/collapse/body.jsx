import React from "react";
import { MDBTable, MDBTableHead, MDBTableBody } from "mdbreact";
import { Statements } from "../../../../../../../services/fakeDb";
import {
  currency,
  dateFormat,
  fullName,
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
          } = deal;

          const particular = payableId?.particular || par;
          const supplier = payableId?.supplier || supp;

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
                <h6>{currency.format(amount)}</h6>
                <small>Remarks : {remarks}</small>
              </td>
            </tr>
          );
        })}
      </MDBTableBody>
    </MDBTable>
  );
}

// return (
//   <>
//     <MDBRow>
//       <MDBCol md={6}>
//         <h5>Deductions</h5>
//         {Object.entries(deduction || {}).map(([key, value]) => (
//           <div key={key} className="d-flex justify-content-between">
//             <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
//             <MDBBadge color="danger">{value}</MDBBadge>
//           </div>
//         ))}
//       </MDBCol>

//       <MDBCol md={6}>
//         <h5>Earnings</h5>
//         {Object.entries(earn || {}).map(([key, value]) => (
//           <div key={key} className="d-flex justify-content-between">
//             <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
//             <MDBBadge color="success">{value}</MDBBadge>
//           </div>
//         ))}
//       </MDBCol>
//     </MDBRow>
//   </>
// );
