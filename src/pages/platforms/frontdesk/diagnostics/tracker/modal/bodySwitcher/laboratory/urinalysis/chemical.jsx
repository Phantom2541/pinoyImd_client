import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBCol, MDBRow } from "mdbreact";
import { ResultInRange } from "./../../../../../../../../../services/fakeDb";

export default function Chemical() {
  const dispatch = useDispatch();
  const { task } = useSelector(({ validator }) => validator);

  const chemSelects = [
    "Sugar",
    "Protein",
    "Bilirubin",
    "Ketone",
    "Blood",
    "Urobilinogen",
    "Nitrate",
    "Leukocytes",
  ];

  // Initialize `ce` array if not present or not the expected length
  useEffect(() => {
    if (!Array.isArray(task?.ce) || task.ce.length !== chemSelects.length) {
      const defaultCe = Array(chemSelects.length).fill(0);
      dispatch(SetTASK({ task: { ...task, ce: defaultCe } }));
    }
  }, [task, dispatch]);

  const handleSelectChange = (index, value) => {
    const updatedCe = [...(task?.ce || Array(chemSelects.length).fill(0))];
    updatedCe[index] = Number(value);

    dispatch(SetPARAMS({ key: "ce", value: updatedCe }));
    dispatch(SetTASK({ task: { ...task, ce: updatedCe } }));
  };

  return (
    <MDBRow className="text-left">
      {chemSelects.map((label, index) => (
        <MDBCol md="6" key={`${label}-${index}`}>
          <label>{label}</label>
          <select
            value={task?.ce?.[index] ?? ""}
            className="form-control mb-2"
            onChange={(e) => handleSelectChange(index, e.target.value)}
          >
            <option value="">Select...</option>
            {ResultInRange.map((choice, i) => (
              <option key={i} value={i}>
                {choice}
              </option>
            ))}
          </select>
        </MDBCol>
      ))}
    </MDBRow>
  );
}
