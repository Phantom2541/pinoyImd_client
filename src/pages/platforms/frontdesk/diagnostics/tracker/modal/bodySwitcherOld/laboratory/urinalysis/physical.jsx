import React from "react";
import {
  MDBCol,
  MDBRow,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";

const colors = [
    "Very Light Yellow",
    "Light Yellow",
    "Yellow (Healthy)",
    "Dark Yellow",
    "Reddish Yellow",
    "Orange",
    "Amber",
  ],
  transparencies = ["Clear (Healthy)", "Slightly Turbid", "Turbid"],
  reactions = ["5.0", "6.0 (Healthy)", "6.5", "7.0", "7.5", "8.0", "8.5"],
  gravities = ["1.005", "1.010 (Healthy)", "1.015", "1.020", "1.025", "1.030"];

export default function Physical({ task, setTask }) {
  const handleSelectChange = (index, value) => {
    const _pe = [...task.pe];
    _pe[index] = value;

    setTask({
      ...task,
      pe: _pe,
    });
  };

  const { pe } = task;

  return (
    <MDBRow>
      <MDBCol md="6">
        <MDBSelect
          getValue={e => handleSelectChange(0, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={colors[pe[0]] ? `Color: ${colors[pe[0]]}` : "Color"}
          />
          <MDBSelectOptions>
            {colors.map((color, index) => (
              <MDBSelectOption key={`color-${index}`} value={String(index)}>
                <span className="d-none">Color: </span>
                {color}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
      <MDBCol md="6">
        <MDBSelect
          getValue={e => handleSelectChange(1, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={
              transparencies[pe[1]]
                ? `Transparency: ${transparencies[pe[1]]}`
                : "Transparency"
            }
          />
          <MDBSelectOptions>
            {transparencies.map((transparency, index) => (
              <MDBSelectOption
                key={`transparency-${index}`}
                value={String(index)}
              >
                <span className="d-none">Transparency: </span>
                {transparency}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
      <MDBCol md="6">
        <MDBSelect
          getValue={e => handleSelectChange(2, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={
              gravities[pe[2]]
                ? `Specific Gravity: ${gravities[pe[2]]}`
                : "Specific Gravity"
            }
          />
          <MDBSelectOptions>
            {gravities.map((gravity, index) => (
              <MDBSelectOption key={`gravity-${index}`} value={String(index)}>
                <span className="d-none">Specific Gravity: </span>
                {gravity}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
      <MDBCol md="6">
        <MDBSelect
          getValue={e => handleSelectChange(3, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={
              reactions[pe[3]]
                ? `Reaction / pH: ${reactions[pe[3]]}`
                : "Reaction / pH"
            }
          />
          <MDBSelectOptions>
            {reactions.map((reaction, index) => (
              <MDBSelectOption key={`reactions-${index}`} value={String(index)}>
                <span className="d-none">Reaction / pH: </span>
                {reaction}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
    </MDBRow>
  );
}
