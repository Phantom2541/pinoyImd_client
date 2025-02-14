import React from "react";
import { MDBTable } from "mdbreact";

const _troupe = {
  retic: 0,
  esr: 0,
};

export default function SpecialTest({ task, setTask }) {
  const { troupe = _troupe, packages } = task,
    { retic, esr } = troupe;

  const handleChange = (key, value) =>
    setTask({
      ...task,
      troupe: {
        ...troupe,
        [key]: Number(value),
      },
    });

  return (
    <MDBTable hover responsive className="mb-0">
      <thead>
        <tr>
          <th className="py-1">Category</th>
          <th className="py-1">Result</th>
          <th className="py-1">Reference</th>
        </tr>
      </thead>
      <tbody>
        {packages.includes(62) && (
          <tr>
            <td className="py-1">Reticulocytes</td>
            <td className="py-1">
              <input
                type="number"
                value={retic}
                onChange={e => handleChange("retic", e.target.value)}
                className="w-100 text-center fw-bold"
              />
            </td>
            <td className="py-1">0.5-1.5%</td>
          </tr>
        )}
        {packages.includes(63) && (
          <tr>
            <td className="py-1">ESR</td>
            <td className="py-1">
              <input
                type="number"
                value={esr}
                onChange={e => handleChange("esr", e.target.value)}
                className="w-100 text-center fw-bold"
              />
            </td>
            <td className="py-1">0-15 mm/hr</td>
          </tr>
        )}
      </tbody>
    </MDBTable>
  );
}
