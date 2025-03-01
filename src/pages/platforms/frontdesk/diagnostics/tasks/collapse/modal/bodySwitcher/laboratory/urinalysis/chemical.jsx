import React from "react";
import { MDBCol, MDBRow } from "mdbreact";
import CustomSelect from "../../../../../../../../../../components/searchables/customSelect";
import { ResultInRange } from "../../../../../../../../../../services/fakeDb";

export default function Chemical({ task, setTask }) {
  const handleSelectChange = (index, value) => {
    const _ce = [...task.ce];
    _ce[index] = value;

    setTask({
      ...task,
      ce: _ce,
    });
  };
  const { ce } = task;

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
          <CustomSelect
            choices={ResultInRange.map((u, i) => ({ str: u, index: i }))}
            label={label}
            preValue={String(ce[index])}
            texts="str"
            values="index"
            onChange={(e) => handleSelectChange(index, Number(e))}
          />
        </MDBCol>
      ))}
    </MDBRow>
  );
}
