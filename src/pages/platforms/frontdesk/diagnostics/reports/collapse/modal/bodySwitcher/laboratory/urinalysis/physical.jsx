import React from "react";
import { MDBCol, MDBRow } from "mdbreact";
import CustomSelect from "../../../../../../../../../../components/customSelect";
import {
  Transparency,
  UrineColors,
  SpecificGravity,
  PH,
} from "../../../../../../../../../../services/fakeDb";

export default function Physical({ task, setTask }) {
  const handleSelectChange = (index, value) => {
    const _pe = [...task.pe];
    _pe[index] = value;

    setTask({
      ...task,
      pe: _pe,
    });
  };

  const { pe } = task;

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

  return (
    <MDBRow className="text-left">
      {physicalSelects.map(({ label, choices }, index) => (
        <MDBCol md="6" key={`${label}-${index}`}>
          <CustomSelect
            choices={choices.map((u, i) => ({ str: u, index: i }))}
            label={label}
            preValue={String(pe[index])}
            texts="str"
            values="index"
            onChange={(e) => handleSelectChange(index, Number(e))}
          />
        </MDBCol>
      ))}
    </MDBRow>
  );
}
