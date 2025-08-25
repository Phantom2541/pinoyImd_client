import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";

import { MDBCol, MDBRow } from "mdbreact";
import {
  MicroscopicInRange,
  MicroscopicResultInWord,
} from "./../../../../../../../../../services/fakeDb";

export default function Microscopic() {
  const dispatch = useDispatch();
  const { task } = useSelector(({ validator }) => validator);

  // Ensure `me` exists in task
  useEffect(() => {
    if (!task?.me || !Array.isArray(task.me)) {
      const defaultMe = Array(6).fill(0);
      dispatch(SetTASK({ task: { ...task, me: defaultMe } }));
    }
  }, [task, dispatch]);

  const handleSelectChange = (index, value) => {
    const _me = [...(task?.me || Array(6).fill(0))];
    _me[index] = Number(value);
    dispatch(SetPARAMS({ key: "me", value: _me }));
    dispatch(SetTASK({ task: { ...task, me: _me } }));
  };

  const microscopicSelects = [
    "Pus Cells",
    "Red Cells",
    "Epithelial Cells",
    "Mucus Threads",
    "Amorphous Urates",
    "Bacteria",
  ];

  return (
    <MDBRow className="text-left">
      {microscopicSelects.map((label, index) => {
        const choices =
          index > 1 ? MicroscopicResultInWord : MicroscopicInRange;

        return (
          <MDBCol key={`${label}-${index}`} md="6">
            <label htmlFor="">{label}</label>
            <select
              value={task?.me?.[index] ?? ""}
              className="form-control mb-2"
              onChange={(e) => handleSelectChange(index, e.target.value)}
            >
              <option value="">Select</option>
              {choices.map((choice, i) => (
                <option key={i} value={i}>
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
