import React from "react";
import { MDBTable } from "mdbreact";
import Forms from "./forms";
import { useSelector } from "react-redux";

export default function Body({ _id, customer, forms }) {
  const { activePlatform } = useSelector(({ auth }) => auth);

  console.log("forms:", forms);

  return (
    <MDBTable small hover responsive>
      <thead>
        <tr>
          <th>Performer</th>
          <th>Template</th>
          <th>Services</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(forms || {})?.map(([key, value], index) => {
          const isEmpty =
            !value || (Array.isArray(value) && value.length === 0);

          if (isEmpty && activePlatform.department === "laboratory") {
            return (
              <tr key={`empty-${index}`}>
                <td colSpan={4}>Empty Test</td>
              </tr>
            );
          }

          // For Radiology (or any non-laboratory), still render even if null/empty
          return (
            <Forms
              _id={_id}
              key={`form-${index}`}
              form={key}
              obj={value || {}}
              customer={customer}
              index={index}
            />
          );
        })}
      </tbody>
    </MDBTable>
  );
}
