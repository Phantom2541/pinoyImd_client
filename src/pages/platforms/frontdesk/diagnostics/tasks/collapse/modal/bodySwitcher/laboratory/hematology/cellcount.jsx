import React from "react";
import { MDBTable } from "mdbreact";
import { Cellcount as CellCount } from "../../../../../../../../../../services/fakeDb";
import { Markup } from "interweave";

export default function Cellcount({ task, setTask }) {
  const { patient, cc = [] } = task,
    { Preferences, Abbreviation, Title } = CellCount;

  const handleChange = (e) => {
    const { name, value } = e.target,
      _name = Number(name),
      // _value = parseFloat(value),
      _cells = [...cc];

    // cell count float
    _cells[_name] = value;

    if (!_name) {
      _cells[1] = parseFloat((Number(value) * 340).toFixed(0));
      _cells[2] = parseFloat((Number(value) * 11).toFixed(2));
    }

    while (_cells.length < 4) {
      _cells.push(0);
    }

    setTask({
      ...task,
      cc: _cells,
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
      <tbody>
        {(!!cc.length ? cc : [0, 0, 0, 0]).map((cell, index) => {
          const { lo, hi, unit } =
            Preferences[patient.isMale ? "Male" : "Female"][
              Abbreviation[index]
            ];

          return (
            <tr key={`cell-${index}`}>
              <td className="py-1">{Title[index]}</td>
              <td className="py-1">
                <input
                  type="number"
                  style={{
                    color: cell ? (cell < lo ? "red" : cell > hi && "red") : "",
                  }}
                  name={index}
                  value={String(cell)}
                  onChange={handleChange}
                  className="w-100 text-center fw-bold"
                />
              </td>
              <td className="py-1">
                {lo} - {hi} <Markup content={unit} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
}
