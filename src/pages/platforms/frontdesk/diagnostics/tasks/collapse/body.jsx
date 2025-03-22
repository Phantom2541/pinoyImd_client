import React from "react";
import { MDBTable } from "mdbreact";
import Forms from "./forms";

export default function Body({ customer, forms }) {
  
  return (
    <>
      <MDBTable small hover responsive>
        <thead>
          <tr>
            <th>Performer</th>
            <th>Template</th>
            <th>Services</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {Object.entries(forms)?.map(([key, value], index) => {
            if (!value || value.length === 0) {
              return (
                <tr key={`empty-${index}`}>
                  <td colSpan={4}>Empty Test</td>
                </tr>
              );
            }

            return <Forms key={key} form={key} obj={value} customer={customer} index={index} />;
          })}
        </tbody>
      </MDBTable>
    </>
  );
}
