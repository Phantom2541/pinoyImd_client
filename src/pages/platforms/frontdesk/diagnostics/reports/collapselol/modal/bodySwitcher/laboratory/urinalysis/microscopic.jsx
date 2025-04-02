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
          getValue={e => handleSelectChange(0, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={hpfs[me[0]] ? `Pus Cells: ${hpfs[me[0]]}`:"Pus Cells"}
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
          getValue={e => handleSelectChange(1, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={hpfs[me[1]] ? `Red Cells: ${hpfs[me[1]]}`:"Red Cells"}
          />
          <MDBSelectOptions>
            {hpfs.map((hpf, index) => (
              <MDBSelectOption key={`Red-${index}`} value={String(index)}>
                <span className="d-none">Red Cells: </span>
                {hpf}
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
             selected={cells[me[2]] ? `Epithelial Cell: ${cells[me[2]]}`:"Epithelial Cell"}
          />
          <MDBSelectOptions>
            {cells.map((cell, index) => (
              <MDBSelectOption
                key={`Epithelial-${index}`}
                value={String(index)}
              >
                <span className="d-none">Epithelial Cell: </span>
                {cell}
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
            selected={cells[me[3]] ? `Mucus Threads: ${cells[me[3]]}`:"Mucus Threads"}
          />
          <MDBSelectOptions>
            {cells.map((cell, index) => (
              <MDBSelectOption key={`Mucus-${index}`} value={String(index)}>
                <span className="d-none">Mucus Threads: </span>
                {cell}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
      <MDBCol md="6">
        <MDBSelect
          getValue={e => handleSelectChange(4, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={cells[me[4]] ? `Amorphous Urates: ${cells[me[4]]}`:"Amorphous Urates"}
          />
          <MDBSelectOptions>
            {cells.map((cell, index) => (
              <MDBSelectOption key={`Amorphous-${index}`} value={String(index)}>
                <span className="d-none">Amorphous Urates: </span>
                {cell}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
      <MDBCol md="6">
        <MDBSelect
          getValue={e => handleSelectChange(5, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={cells[me[5]] ? `Bacteria: ${cells[me[5]]}`:"Bacteria"}
          />
          <MDBSelectOptions>
            {cells.map((cell, index) => (
              <MDBSelectOption key={`Bacteria-${index}`} value={String(index)}>
                <span className="d-none">Bacteria: </span>
                {cell}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
    </MDBRow>
  );
}
