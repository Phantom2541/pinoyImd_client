import React from "react";
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
  MDBTable,
} from "mdbreact";

const _troupe = {
    bt: [],
    ct: [],
  },
  options = ["00", "15", "30", "45"];

export default function ClottingFactor({ task, setTask }) {
  const { troupe = _troupe, packages } = task,
    { bt, ct } = troupe;

  const handleChange = (key, index, value) => {
    const arr = [...troupe[key]];

    arr[index] = value;

    setTask({
      ...task,
      troupe: {
        ...troupe,
        [key]: arr,
      },
    });
  };

  return (
    <MDBTable hover responsive className="mb-0">
      <thead>
        <tr>
          <th className="py-1">Category</th>
          <th className="py-1">Result</th>
          <th className="py-1">Reference</th>
        </tr>
      </thead>
      <tbody style={{ height: "300px" }}>
        {packages.includes(60) && (
          <tr>
            <td className="py-1">Bleeding Time</td>
            <td className="py-1 d-flex align-items-center">
              <input
                type="number"
                value={String(bt[0] || 0)}
                onChange={e => handleChange("bt", 0, Number(e.target.value))}
                className="w-50 h-100 text-center fw-bold my-0 py-0"
              />
              <MDBSelect
                getValue={e => handleChange("bt", 1, Number(e[0]))}
                className="colorful-select dropdown-primary hidden-md-down w-50 my-0 py-0"
              >
                <MDBSelectInput
                  selected={`Bleeding Time${bt[1] && `: ${bt[1]}`}`}
                />
                <MDBSelectOptions>
                  {options.map((option, index) => (
                    <MDBSelectOption key={`bt-${index}`} value={String(index)}>
                      <span className="d-none">Bleeding Time: </span>
                      {option} sec.
                    </MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
            </td>
            <td className="py-1">2-4 min</td>
          </tr>
        )}
        {packages.includes(61) && (
          <tr>
            <td className="py-1">Clotting Time</td>
            <td className="py-1 d-flex align-items-center">
              <input
                type="number"
                value={String(ct[0] || 0)}
                onChange={e => handleChange("ct", 0, Number(e.target.value))}
                className="w-50 h-100 text-center fw-bold my-0 py-0"
              />
              <MDBSelect
                getValue={e => handleChange("ct", 1, Number(e[0]))}
                className="colorful-select dropdown-primary hidden-md-down w-50 my-0 py-0"
              >
                <MDBSelectInput
                  selected={`Clotting Time${ct[1] && `: ${ct[1]}`}`}
                />
                <MDBSelectOptions>
                  {options.map((option, index) => (
                    <MDBSelectOption key={`bt-${index}`} value={String(index)}>
                      <span className="d-none">Clotting Time: </span>
                      {option} sec.
                    </MDBSelectOption>
                  ))}
                </MDBSelectOptions>
              </MDBSelect>
            </td>
            <td className="py-1">2-4 min</td>
          </tr>
        )}
      </tbody>
    </MDBTable>
  );
}
