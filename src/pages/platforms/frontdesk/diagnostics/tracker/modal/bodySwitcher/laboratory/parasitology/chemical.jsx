import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBCol, MDBRow } from "mdbreact";

const phs = ["5.0", "6.0", "6.5", "7.0", "7.5", "8.0", "8.5"];
const occults = ["Negative", "Positive"];
const labels = ["Stool pH", "Occult Blood"];
const choices = [phs, occults];

export default function Chemical() {
  const { task } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();
  const ce = task?.ce || [];

  const handleSelectChange = (index, value) => {
    const updatedCe = [...ce];
    updatedCe[index] = Number(value);
    dispatch(SetPARAMS({ key: "ce", value: updatedCe }));
    dispatch(SetTASK({ task: { ...task, ce: updatedCe } }));
  };

  return (
    <MDBRow>
      {labels.map((label, index) => (
        <MDBCol md="6" key={label}>
          <label>{label}</label>
          <select
            className="form-control mb-2"
            value={ce[index] ?? ""}
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
