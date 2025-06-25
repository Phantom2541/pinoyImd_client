import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBCol, MDBRow } from "mdbreact";

const colors = [
  "Dark Brown (Healthy)",
  "Brown",
  "Light Brown",
  "Dark Yellow",
  "Yellow",
  "Reddish",
  "Greenish",
  "Gray",
];

const consistencies = [
  "Formed",
  "Semi-Formed",
  "Soft",
  "Watery",
  "Mucoid",
  "Watery Mucoid",
];

const labels = ["Color", "Consistency"];
const choices = [colors, consistencies];

export default function Physical() {
  const { task } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();
  const pe = task?.pe || [];

  const handleSelectChange = (index, value) => {
    const updatedPe = [...pe];
    updatedPe[index] = Number(value);
    dispatch(SetPARAMS({ key: "pe", value: updatedPe }));
    dispatch(SetTASK({ task: { ...task, pe: updatedPe } }));
  };

  return (
    <MDBRow>
      {labels.map((label, index) => (
        <MDBCol md="6" key={label}>
          <label>{label}</label>
          <select
            className="form-control mb-2"
            value={pe[index] ?? ""}
            onChange={(e) => handleSelectChange(index, e.target.value)}
          >
            <option value="">Select</option>
            {choices[index].map((item, i) => (
              <option key={`${label}-${i}`} value={i}>
                {item}
              </option>
            ))}
          </select>
        </MDBCol>
      ))}
    </MDBRow>
  );
}
