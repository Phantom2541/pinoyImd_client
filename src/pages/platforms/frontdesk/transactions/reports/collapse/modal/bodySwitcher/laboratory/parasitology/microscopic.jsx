import React from "react";
import {
  MDBCol,
  MDBRow,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";

const hpfs = [
    "0-1/hpf",
    "0-2/hpf (Healthy)",
    "1-3/hpf",
    "2-4/hpf",
    "3-5/hpf",
    "4-6/hpf",
    "6-8/hpf",
    "8-10/hpf",
    "10-15/hpf",
    "15-20/hpf",
    "20-25/hpf",
    "25-30/hpf",
    "30-40/hpf",
    "40-50/hpf",
    "60-80/hpf",
    "> 100/hpf",
  ],
  bacterias = ["+1", "+2", "+3", "+4"],
  cells = ["RARE", "FEW", "MODERATE", "PLENTY"];

export default function Microscopic({ task, setTask }) {
  const handleSelectChange = (index, value) => {
    const _me = [...task.me];
    _me[index] = value;

    setTask({
      ...task,
      me: _me,
    });
  };

  const { me } = task;

  return (
    <MDBRow>
      <MDBCol md="6">
        <MDBSelect
          getValue={(e) => handleSelectChange(0, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={`Pus Cells${hpfs[me[0]] && `: ${hpfs[me[0]]}`}`}
          />
          <MDBSelectOptions>
            {hpfs.map((hpf, index) => (
              <MDBSelectOption key={`Pus-${index}`} value={String(index)}>
                <span className="d-none">Pus Cells: </span>
                {hpf}
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
            selected={`RBC${hpfs[me[1]] && `: ${hpfs[me[1]]}`}`}
          />
          <MDBSelectOptions>
            {hpfs.map((hpf, index) => (
              <MDBSelectOption key={`RBC-${index}`} value={String(index)}>
                <span className="d-none">RBC: </span>
                {hpf}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
      <MDBCol md="6">
        <MDBSelect
          getValue={(e) => handleSelectChange(2, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={`Bacteria${bacterias[me[2]] && `: ${bacterias[me[2]]}`}`}
          />
          <MDBSelectOptions>
            {bacterias.map((bacteria, index) => (
              <MDBSelectOption key={`bacterias-${index}`} value={String(index)}>
                <span className="d-none">Bacteria: </span>
                {bacteria}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
      <MDBCol md="6">
        <MDBSelect
          getValue={(e) => handleSelectChange(3, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={`Yeast Cells${cells[me[3]] ? `: ${cells[me[3]]}` : ""}`}
          />
          <MDBSelectOptions>
            <MDBSelectOption>
              <span className="d-none">Yeast Cells: </span>
            </MDBSelectOption>
            {cells.map((cell, index) => (
              <MDBSelectOption key={`Yeast-${index}`} value={String(index)}>
                <span className="d-none">Yeast Cells: </span>
                {cell}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
      <MDBCol md="6">
        <MDBSelect
          getValue={(e) => handleSelectChange(4, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={`Fat Globules${cells[me[4]] ? `: ${cells[me[4]]}` : ""}`}
          />
          <MDBSelectOptions>
            <MDBSelectOption>
              <span className="d-none">Fat Globules: </span>
            </MDBSelectOption>
            {cells.map((cell, index) => (
              <MDBSelectOption key={`Fat-${index}`} value={String(index)}>
                <span className="d-none">Fat Globules: </span>
                {cell}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
    </MDBRow>
  );
}
