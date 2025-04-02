import React from "react";
import { MDBRow, MDBCol } from "mdbreact";
import { Services } from "./../../../../../../../../../../services/fakeDb";
import { Select } from "./../../../../../../../../../../components/customizable";

export default function Cluster({ task, setTask }) {
  const { packages = [], results = {} } = task;

  const handleSelectChange = (name, value) =>
    setTask({ ...task, results: { ...results, [name]: value } });

  return (
    <MDBRow className="text-left">
      {packages.map((fk, index) => {
        const { abbreviation, name } = Services.find(fk);

        return (
          <MDBCol key={`cluster-${index}`}>
            <Select
              inputClassName={results[fk] && "text-danger"}
              collections={[
                {
                  str: "NON-REACTIVE",
                  index: 0,
                },
                {
                  str: "REACTIVE",
                  index: 1,
                },
              ]}
              label={abbreviation || name}
              keys="index"
              values="str"
              onChange={(e) => handleSelectChange(fk, Number(e))}
              preValue={String(results[fk] || 0)}
            />
          </MDBCol>
        );
      })}
    </MDBRow>
  );
}
