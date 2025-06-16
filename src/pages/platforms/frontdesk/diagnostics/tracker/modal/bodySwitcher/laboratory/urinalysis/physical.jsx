import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBCol, MDBRow } from "mdbreact";
import {
  Transparency,
  UrineColors,
  SpecificGravity,
  PH,
} from "./../../../../../../../../../services/fakeDb";

export default function Physical() {
  const dispatch = useDispatch();
  const { task } = useSelector(({ validator }) => validator);

  const physicalSelects = [
    {
      label: "Color",
      choices: UrineColors,
    },
    {
      label: "Transparency",
      choices: Transparency,
    },
    {
      label: "Specific Gravity",
      choices: SpecificGravity,
    },
    {
      label: "Reaction / pH",
      choices: PH,
    },
  ];

  // Initialize `pe` if missing or incomplete
  useEffect(() => {
    if (!Array.isArray(task?.pe) || task.pe.length !== physicalSelects.length) {
      const defaultPe = Array(physicalSelects.length).fill(0);
      dispatch(SetTASK({ task: { ...task, pe: defaultPe } }));
    }
  }, [task, dispatch]);

  const handleSelectChange = (index, value) => {
    const _pe = [...(task?.pe || Array(physicalSelects.length).fill(0))];
    _pe[index] = Number(value);
    dispatch(SetPARAMS({ key: "pe", value: _pe }));
    dispatch(SetTASK({ task: { ...task, pe: _pe } }));
  };

  return (
    <MDBRow className="text-left">
      {physicalSelects.map(({ label, choices }, index) => (
        <MDBCol md="6" key={`${label}-${index}`}>
          <label>{label}</label>
          <select
            value={task?.pe?.[index] ?? ""}
            className="form-control mb-2"
            onChange={(e) => handleSelectChange(index, e.target.value)}
          >
            <option value="">Select...</option>
            {choices.map((choice, i) => (
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
