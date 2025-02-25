import React from "react";
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";

export default function Pregnancy({ task, setTask }) {
  const { specimen } = task;

  return (
    <MDBSelect
      getValue={(e) => setTask({ ...task, specimen: e[0] })}
      className="colorful-select dropdown-primary hidden-md-down"
    >
      <MDBSelectInput
        selected={
          task.hasOwnProperty("specimen") ? `Category: ${specimen}` : "Category"
        }
      />
      <MDBSelectOptions>
        <MDBSelectOption value="50 grams">
          <span className="d-none">Category: </span>
          50 grams
        </MDBSelectOption>
        <MDBSelectOption value="75 grams">
          <span className="d-none">Category: </span>75 grams
        </MDBSelectOption>
        <MDBSelectOption value="100 grams">
          <span className="d-none">Category: </span>100 grams
        </MDBSelectOption>
      </MDBSelectOptions>
    </MDBSelect>
  );
}
