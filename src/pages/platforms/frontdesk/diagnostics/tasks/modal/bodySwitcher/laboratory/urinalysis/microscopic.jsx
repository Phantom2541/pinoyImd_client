import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetPARAMS, SetTASK } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";

import { MDBCol, MDBRow } from "mdbreact";
import { Select } from "./../../../../../../../../../components/customizable";
import {
  MicroscopicInRange,
  MicroscopicResultInWord,
} from "./../../../../../../../../../services/fakeDb";

export default function Microscopic() {
  const { task } = useSelector(({ validator }) => validator),
    dispatch = useDispatch();
  const { me } = task;
  const handleSelectChange = (index, value) => {
    const _me = [...me];
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
            {/* <Select
              disableSearch
              collections={choices}
              label={label}
              preValue={String(me[index])}
              texts="str"
              values="index"
              onChange={(e) => handleSelectChange(index, Number(e))}
            /> */}
            <label htmlFor="">{ label}</label>
             <select value={me[index]} className="form-control mb-2" onChange={(e) => handleSelectChange(index, e.target.value)}>
            <option ></option>
            {choices.map((choice, i) => {
              
             return (

              <option key={i} value={i}>
                {choice}
              </option>
            )})}  
          </select>
          </MDBCol>
        );
      })}
    </MDBRow>
  );
}
