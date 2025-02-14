import React from "react";
import {
  MDBRow,
  MDBCol,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOptions,
  MDBSelectOption,
} from "mdbreact";

const colors = {
    0: "warning",
    1: "danger",
    2: "primary",
  },
  types = ["A", "B", "O", "AB"];

export default function BloodTyping({ task, setTask }) {
  const { results = { bt: null, rh: null } } = task;

  const handleSelectChange = (name, value) =>
    setTask({ ...task, results: { ...results, [name]: value } });

  return (
    <MDBRow>
      <MDBCol md="6">
        <MDBSelect
          getValue={e => handleSelectChange("bt", Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            className={`text-${colors[results.bt]}`}
            selected={
              String(results.bt)
                ? `Blood Type: ${types[results.bt]}`
                : "Blood Type"
            }
          />
          <MDBSelectOptions>
            {types.map((type, index) => (
              <MDBSelectOption key={`type-${index}`} value={String(index)}>
                <span className="d-none">Blood Type: </span>
                {type}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
      <MDBCol md="6">
        <MDBSelect
          getValue={e => handleSelectChange("rh", Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            className={`${results.rh === 1 && "text-danger"}`}
            selected={
              String(results.rh)
                ? `RH: ${Boolean(results.rh) ? "POSITIVE" : "NEGATIVE"}`
                : "RH"
            }
          />
          <MDBSelectOptions>
            <MDBSelectOption value="0">
              <span className="d-none">RH: </span>NEGATIVE
            </MDBSelectOption>
            <MDBSelectOption value="1">
              <span className="d-none">RH: </span>POSITIVE
            </MDBSelectOption>
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
    </MDBRow>
  );
}
