import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetPARAMS } from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBCol, MDBRow } from "mdbreact";
import CustomSelect from "./../../../../../../../../../components/searchables/customSelect";
import { ResultInRange } from "./../../../../../../../../../services/fakeDb";

export default function Chemical() {
  const {ce} = useSelector(({validator}) => validator.task),
  dispatch = useDispatch();

  const handleSelectChange = (index, value) => {
    const _ce = [ce];
    _ce[index] = value;
dispatch(SetPARAMS({ key: "ce", value: _ce }));
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
          <CustomSelect
            collections={ResultInRange}
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
