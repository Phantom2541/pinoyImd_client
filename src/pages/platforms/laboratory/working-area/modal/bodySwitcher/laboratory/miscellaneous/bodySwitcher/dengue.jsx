import React from "react";
import { MDBRow, MDBCol } from "mdbreact";

const choices = [
  {
    str: "Negative",
  },
  {
    str: "Positive",
  },
];

export default function Dengue({ task, setTask }) {
  const { results = { igg: 0, igm: 0, ns1: 0 }, packages = [] } = task;

  const handleSelectChange = (name, value) => {
    console.log([name], value);

    setTask({ ...task, results: { ...results, [name]: value } });

    return (
      <MDBRow className="text-left">
        {packages.includes(77) && (
          <MDBCol>
            <select
              name="ns1"
              onChange={(e) =>
                handleSelectChange("ns1", Number(e.target.value))
              }
              value={String(results.ns1)}
              className="form-control"
            >
              <option> NS1 Antigen </option>
              {choices.map((data) => (
                <option value={data.index}>{data.str}</option>
              ))}
            </select>
          </MDBCol>
        )}
        <MDBCol>
          <select
            name="igg"
            onChange={(e) => handleSelectChange("igg", Number(e.target.value))}
            value={String(results.igg)}
            className="form-control"
          >
            <option> Antibody IgG </option>
            {choices.map((data) => (
              <option value={data.index}>{data.str}</option>
            ))}
          </select>
        </MDBCol>
        <MDBCol>
          <select
            name="igm"
            onChange={(e) => handleSelectChange("igm", Number(e.target.value))}
            value={String(results.igm)}
            className="form-control"
          >
            <option> Antibody IgM </option>
            {choices.map((data) => (
              <option value={data.index}>{data.str}</option>
            ))}
          </select>
        </MDBCol>
      </MDBRow>
    );
  };
}
