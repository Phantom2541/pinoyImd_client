import React from "react";
import { MDBRow, MDBCol } from "mdbreact";
import CustomSelect from "../../../../../../../../../../../components/customSelect";

const choices = [
  {
    str: "Negative",
    index: 0,
  },
  {
    str: "Positive",
    index: 1,
  },
];

export default function Dengue({ task, setTask }) {
  const { results = { igg: 0, igm: 0, ns1: 0 }, packages = [] } = task;

  const handleSelectChange = (name, value) =>
    setTask({ ...task, results: { ...results, [name]: value } });

  return (
    <MDBRow className="text-left">
      {packages.includes(77) && (
        <MDBCol>
          <CustomSelect
            inputClassName={results.ns1 && "text-danger"}
            choices={choices}
            label="NS1 Antigen"
            preValue={String(results.ns1)}
            texts="str"
            values="index"
            onChange={(e) => handleSelectChange("ns1", Number(e))}
          />
        </MDBCol>
      )}
      <MDBCol>
        <CustomSelect
          inputClassName={results.igg && "text-danger"}
          choices={choices}
          label="Antibody IgG"
          preValue={String(results.igg)}
          texts="str"
          values="index"
          onChange={(e) => handleSelectChange("igg", Number(e))}
        />
      </MDBCol>
      <MDBCol>
        <CustomSelect
          inputClassName={results.igm && "text-danger"}
          choices={choices}
          label="Antibody IgM"
          preValue={String(results.igm)}
          texts="str"
          values="index"
          onChange={(e) => handleSelectChange("igm", Number(e))}
        />
      </MDBCol>
    </MDBRow>
  );
}
