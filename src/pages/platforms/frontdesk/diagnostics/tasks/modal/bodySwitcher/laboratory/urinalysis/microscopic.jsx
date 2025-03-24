import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetPARAMS } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";

import { MDBCol, MDBRow } from "mdbreact";
import { Select } from "./../../../../../../../../../components/customizable";
import {
  MicroscopicInRange,
  MicroscopicResultInWord,
} from "./../../../../../../../../../services/fakeDb";

export default function Microscopic() {
  const { me } = useSelector(({ validator }) => validator.task),
    dispatch = useDispatch();
  const handleSelectChange = (index, value) => {
    const _me = [...me];
    _me[index] = value;
    dispatch(SetPARAMS({ key: "me", value: _me }));
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
            <Select
              disableSearch
              choices={choices.map((u, i) => ({ str: u, index: i }))}
              label={label}
              preValue={String(me[index])}
              texts="str"
              values="index"
              onChange={(e) => handleSelectChange(index, Number(e))}
            />
          </MDBCol>
        );
      })}
    </MDBRow>
  );
}
