import React from "react";
import {
  MDBCol,
  MDBRow,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";

const phs = ["5.0", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5"],
  occults = ["Negative", "Positive"];
export default function Chemical({ task, setTask }) {
  const handleSelectChange = (index, value) => {
    const _ce = [...task.ce];
    _ce[index] = value;

    setTask({
      ...task,
      ce: _ce,
    });
  };
  const { ce } = task;
  return (
    <MDBRow>
      <MDBCol md="6">
        <MDBSelect
          getValue={(e) => handleSelectChange(0, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={`Stool pH :${phs[ce[0]] ? `: ${phs[ce[0]]}` : ""}`}
          />
          <MDBSelectOptions>
            <MDBSelectOption>
              <span className="d-none">Stool pH: </span>
            </MDBSelectOption>
            {phs.map((ph, index) => (
              <MDBSelectOption key={`Stool pH-${index}`} value={String(index)}>
                <span className="d-none">Stool pH: </span>
                {ph}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
      <MDBCol md="6">
        <MDBSelect
          getValue={(e) => handleSelectChange(1, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={`Occult Blood${
              occults[ce[1]] ? `: ${occults[ce[1]]}` : ""
            }`}
          />
          <MDBSelectOptions>
            <MDBSelectOption>
              <span className="d-none">Occult Blood: </span>
            </MDBSelectOption>
            {occults.map((occult, index) => (
              <MDBSelectOption
                key={`Occult Blood-${index}`}
                value={String(index)}
              >
                <span className="d-none">Occult Blood: </span>
                {occult}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
    </MDBRow>
  );
}
