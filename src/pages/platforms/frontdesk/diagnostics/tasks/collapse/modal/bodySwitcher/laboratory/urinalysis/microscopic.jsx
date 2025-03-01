import React from "react";
import { MDBCol, MDBRow } from "mdbreact";
import CustomSelect from "../../../../../../../../../../components/searchables/customSelect";
import {
  MicroscopicInRange,
  MicroscopicResultInWord,
} from "../../../../../../../../../../services/fakeDb";

export default function Microscopic({ task, setTask }) {
  const handleSelectChange = (index, value) => {
    const _me = [...task.me];
    _me[index] = value;

    setTask({
      ...task,
      me: _me,
    });
  };

  const { me } = task;

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
            <CustomSelect
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
