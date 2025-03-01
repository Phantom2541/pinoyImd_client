import React from "react";
import { MDBRow, MDBCol } from "mdbreact";
import { Services } from "../../../../../../../../../../../services/fakeDb";
import CustomSelect from "../../../../../../../../../../../components/searchables/customSelect";

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
            <CustomSelect
              inputClassName={results[fk] && "text-danger"}
              choices={[
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
              preValue={String(results[fk] || 0)}
              texts="str"
              values="index"
              onChange={(e) => handleSelectChange(fk, Number(e))}
            />
          </MDBCol>
        );
      })}
    </MDBRow>
  );
}
