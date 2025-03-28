import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetPARAMS, SetTASK } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBCol, MDBRow } from "mdbreact";
import { ResultInRange } from "./../../../../../../../../../services/fakeDb";

export default function Chemical() {
  const { task } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();
  const ce = task?.ce || []; // Ensure ce is always an array

  const handleSelectChange = (index, value) => {
    const updatedCe = [...ce]; // Create a new array to avoid mutation
    updatedCe[index] = Number(value);
    
    dispatch(SetPARAMS({ key: "ce", value: updatedCe }));
    dispatch(SetTASK({ task: { ...task, ce: updatedCe } }));
  };

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

  return (
    <MDBRow className="text-left">
      {chemSelects.map((label, index) => (
        <MDBCol md="6" key={`${label}-${index}`}>
          <label htmlFor="">{label}</label>
          <select
            value={ce[index] ?? ""}
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
