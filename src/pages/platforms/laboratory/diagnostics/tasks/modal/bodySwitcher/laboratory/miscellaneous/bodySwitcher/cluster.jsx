import React, { useEffect } from "react";
import { MDBRow, MDBCol } from "mdbreact";
import { Services } from "./../../../../../../../../../../services/fakeDb";
import { Select } from "./../../../../../../../../../../components/customizable";

export default function Cluster({ task, setTask }) {
  const { packages = [], results = {} } = task;
  // {68: 0, 69: 0, 70: 0 }
  useEffect(() => {
    //to implement default value
    const expectedResults = packages.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {});

    if (packages.length !== Object.keys(results).length) {
      setTask({ ...task, results: { ...results, ...expectedResults } });
    }
  }, [packages, results, setTask]);
  const handleSelectChange = (name, value) =>
    setTask({ ...task, results: { ...results, [name]: value } });

  console.log("results", results);
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
