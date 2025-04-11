import React from "react";
import {
  MDBCol,
  MDBRow,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";

const chems = ["Negative (Healthy)", "Trace", "+1", "+2", "+3", "+4"]

const Selects = ({handleSelectChange, name, value, index}) => {
  return <MDBCol md="6">
  <MDBSelect
    getValue={e => handleSelectChange(index, Number(e[0]))}
    className="colorful-select dropdown-primary hidden-md-down"
  >
    <MDBSelectInput
      selected={ value ? `${name}: ${value}`:name}
    />
    <MDBSelectOptions>
      {chems.map((chem, index) => (
        <MDBSelectOption key={`${name}-${index}`} value={String(index)}>
          <span className="d-none">{name}: </span>
          {chem}
        </MDBSelectOption>
      ))}
    </MDBSelectOptions>
  </MDBSelect>
</MDBCol>
}

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

  const columns = [
  "Sugar",
  "Protein",
  "Bilirubin",
  "Ketone",
  "Blood",
  "Urobilinogen",
  "Nitrate",
  "Leukocytes"
  ]

  return (
    <MDBRow>
      {columns.map((name, index) =>  <Selects key={`chem-col-${index}`} index={index} handleSelectChange={handleSelectChange} name={name} value={chems[ce[index]]} />)}
    </MDBRow>
  );
}
