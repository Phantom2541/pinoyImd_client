import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetPARAMS, SetTASK } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";

import {
  MDBCol,
  MDBRow,
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
} from "mdbreact";

const colors = [
    "Dark Brown (Healthy)",
    "Brown",
    "Light Brown",
    "Yellow",
    "Reddish",
    "Greenish",
    "Gray",
  ],
  consistencies = [
    "Formed",
    "Semi-Formed",
    "Soft",
    "Watery",
    "Mucoid",
    "Watery Mucoid",
  ];


export default function Physical() {
  const {task} = useSelector(({validator}) => validator),
    dispatch = useDispatch();
  const { pe } = task;
  const handleSelectChange = (index, value) => {
    console.log("index", index);
    console.log("value", Number(value));
    
    const _pe = [...pe];
    _pe[index] = value;
    console.log("_pe", _pe);
    
dispatch(SetPARAMS({ key: "pe", value: _pe }));
dispatch(SetTASK({task:{...task, pe: _pe }}));
  };


  return (
    <MDBRow>
      <MDBCol md="6">
        <MDBSelect
          getValue={(e) => handleSelectChange(0, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={`Color${colors[pe[0]] && `: ${colors[pe[0]]}`}`}
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
          getValue={(e) => handleSelectChange(1, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={`Consistency${
              consistencies[pe[1]] && `: ${consistencies[pe[1]]}`
            }`}
          />
          <MDBSelectOptions>
            {consistencies.map((consistency, index) => (
              <MDBSelectOption
                key={`consistency-${index}`}
                value={String(index)}
              >
                <span className="d-none">Consistency: </span>
                {consistency}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>
    </MDBRow>
  );
}
