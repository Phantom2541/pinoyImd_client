import React from "react";
import { MDBRow, MDBCol } from "mdbreact";
import { Select } from "./../../../../../../../../../../components/customizable";

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
  console.log("task", task);
  console.log("results", results);
  console.log("task", choices);

  return (
    <MDBRow className="text-left">
      {packages.includes(77) && (
        <MDBCol>
          {/* <Select
            inputClassName={results.ns1 && "text-danger"}
            collections={choices}
            label="NS1 Antigen"
            preValue={Number(results.ns1)}
            texts="str"
            values="index"
            onChange={(e) => handleSelectChange("ns1", Number(e))}
          /> */}
          <select
            name="ns1"
            onChange={(e) => handleSelectChange("ns1", Number(e))}
            value={String(results.ns1)}
            className="form-control"
          >
            <option> NS1 Antigen </option>
            {choices.map((data) => (
              <option value={data.index}></option>
            ))}
          </select>
        </MDBCol>
      )}
      <MDBCol>
        {/* <Select
          inputClassName={results.igg && "text-danger"}
          collections={choices}
          label="Antibody IgG"
          preValue={Number(results.igg)}
          texts="str"
          values="index"
          onChange={(e) => handleSelectChange("igg", Number(e))}
        /> */}
        <select
          name="igg"
          onChange={(e) => handleSelectChange("ns1", Number(e))}
          value={String(results.ns1)}
          className="form-control"
        >
          <option> Antibody IgG </option>
          {choices.map((data) => (
            <option value={data.index}></option>
          ))}
        </select>
      </MDBCol>
      <MDBCol>
        {/* <Select
          inputClassName={results.igm && "text-danger"}
          collection={choices}
          label="Antibody IgM"
          preValue={Number(results.igm)}
          texts="str"
          values="index"
          onChange={(e) => handleSelectChange("igm", Number(e))}
        /> */}
        <select
          name="igm"
          onChange={(e) => handleSelectChange("ns1", Number(e))}
          value={String(results.ns1)}
          className="form-control"
        >
          <option> Antibody IgM </option>
          {choices.map((data) => (
            <option value={data.index}></option>
          ))}
        </select>
      </MDBCol>
    </MDBRow>
  );
}
