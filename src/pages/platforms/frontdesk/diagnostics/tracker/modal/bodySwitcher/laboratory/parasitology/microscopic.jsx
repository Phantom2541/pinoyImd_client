import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";

import { MDBCol, MDBRow } from "mdbreact";

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

const microscopicSelects = [
  "Pus Cells",
  "RBC",
  "Bacteria",
  "Yeast Cells",
  "Fat Globules",
];

// Choice logic for each index
const getChoices = (index) => {
  if (index === 0 || index === 1) return hpfs;
  if (index === 2) return bacterias;
  return cells;
};

export default function Microscopic() {
  const { task } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();
  const { me = [] } = task;

  const handleSelectChange = (index, value) => {
    const _me = [...me];
    _me[index] = Number(value);
    dispatch(SetPARAMS({ key: "me", value: _me }));
    dispatch(SetTASK({ task: { ...task, me: _me } }));
  };

  return (
    <MDBRow className="text-left">
      {microscopicSelects.map((label, index) => {
        const choices = getChoices(index);

        return (
          <MDBCol key={`${label}-${index}`} md="6">
            <label>{label}</label>
            <select
              className="form-control mb-2"
              value={me[index] ?? ""}
              onChange={(e) => handleSelectChange(index, e.target.value)}
            >
              <option value="">Select</option>
              {choices.map((choice, i) => (
                <option key={`${label}-${i}`} value={i}>
                  {choice}
                </option>
              ))}
            </select>
          </MDBCol>
        );
      })}
    </MDBRow>
  );
}
