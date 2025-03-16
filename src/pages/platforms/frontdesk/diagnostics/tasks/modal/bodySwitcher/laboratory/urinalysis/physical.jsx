import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetPARAMS } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBCol, MDBRow } from "mdbreact";
import CustomSelect from "./../../../../../../../../../components/searchables/customSelect";
import {
  Transparency,
  UrineColors,
  SpecificGravity,
  PH,
} from "./../../../../../../../../../services/fakeDb";

export default function Physical() {
  const {pe} = useSelector(({validator}) => validator.task),
    dispatch = useDispatch();
  const handleSelectChange = (index, value) => {
    const _pe = [...pe];
    _pe[index] = value;
dispatch(SetPARAMS({ key: "pe", value: _pe }));
  };

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
