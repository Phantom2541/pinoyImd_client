import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";

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
];

const bacterias = ["+1", "+2", "+3", "+4"];
const cells = ["RARE", "FEW", "MODERATE", "PLENTY"];

export default function Microscopic() {
  const { task } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();
  const { me } = task;

  const handleChange = (index, value) => {
    const _me = [...me];
    _me[index] = Number(value);
    dispatch(SetPARAMS({ key: "me", value: _me }));
    dispatch(SetTASK({ task: { ...task, me: _me } }));
  };

  return (
    <MDBRow>
      {/* Pus Cells */}
      <MDBCol md="6">
        <MDBSelect
          getValue={(e) => handleChange(0, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={`Pus Cells${hpfs[me[0]] && `: ${hpfs[me[0]]}`}`}
          />
          <MDBSelectOptions>
            {hpfs.map((hpf, index) => (
              <MDBSelectOption key={`Pus-${index}`} value={String(index)}>
                {hpf}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>

      {/* RBC */}
      <MDBCol md="6">
        <MDBSelect
          getValue={(e) => handleChange(1, Number(e[0]))}
          className="colorful-select dropdown-primary hidden-md-down"
        >
          <MDBSelectInput
            selected={`RBC${hpfs[me[1]] && `: ${hpfs[me[1]]}`}`}
          />
          <MDBSelectOptions>
            {hpfs.map((hpf, index) => (
              <MDBSelectOption key={`RBC-${index}`} value={String(index)}>
                {hpf}
              </MDBSelectOption>
            ))}
          </MDBSelectOptions>
        </MDBSelect>
      </MDBCol>

      {/* Bacteria - RADIO */}
      <MDBCol md="6">
        <label className="font-weight-bold">Bacteria</label>
        {bacterias.map((label, index) => (
          <div className="form-check" key={`bacteria-radio-${index}`}>
            <input
              className="form-check-input"
              type="radio"
              name="bacteria"
              id={`bacteria-${index}`}
              value={index}
              checked={me[2] === index}
              onChange={() => handleChange(2, index)}
            />
            <label className="form-check-label" htmlFor={`bacteria-${index}`}>
              {label}
            </label>
          </div>
        ))}
      </MDBCol>

      {/* Yeast Cells - RADIO */}
      <MDBCol md="6">
        <label className="font-weight-bold">Yeast Cells</label>
        {cells.map((label, index) => (
          <div className="form-check" key={`yeast-radio-${index}`}>
            <input
              className="form-check-input"
              type="radio"
              name="yeast"
              id={`yeast-${index}`}
              value={index}
              checked={me[3] === index}
              onChange={() => handleChange(3, index)}
            />
            <label className="form-check-label" htmlFor={`yeast-${index}`}>
              {label}
            </label>
          </div>
        ))}
      </MDBCol>

      {/* Fat Globules - RADIO */}
      <MDBCol md="6">
        <label className="font-weight-bold">Fat Globules</label>
        {cells.map((label, index) => (
          <div className="form-check" key={`fat-radio-${index}`}>
            <input
              className="form-check-input"
              type="radio"
              name="fat"
              id={`fat-${index}`}
              value={index}
              checked={me[4] === index}
              onChange={() => handleChange(4, index)}
            />
            <label className="form-check-label" htmlFor={`fat-${index}`}>
              {label}
            </label>
          </div>
        ))}
      </MDBCol>
    </MDBRow>
  );
}
