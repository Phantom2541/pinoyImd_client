import React from "react";
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";

export default function Pregnancy({ task, setTask }) {
  const { results = false } = task;

  return (
    <MDBSelect
      getValue={e => setTask({ ...task, results: Boolean(Number(e[0])) })}
      className="colorful-select dropdown-primary hidden-md-down"
    >
      <MDBSelectInput
        className={`${results && "text-danger"}`}
        selected={
          task.hasOwnProperty("results")
            ? `Results: ${results ? "POSITIVE" : "NEGATIVE"}`
            : "Results"
        }
      />
      <MDBSelectOptions>
        <MDBSelectOption value="0">
          <span className="d-none">Results: </span>
          NEGATIVE
        </MDBSelectOption>
        <MDBSelectOption value="1">
          <span className="d-none">Results: </span>POSITIVE
        </MDBSelectOption>
      </MDBSelectOptions>
    </MDBSelect>
  );
}
