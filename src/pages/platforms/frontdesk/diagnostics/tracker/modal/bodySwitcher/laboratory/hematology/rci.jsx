import React from "react";
import { MDBTable } from "mdbreact";
import {
  Cellcount,
  Rci as RCI,
} from "../../../../../../../../../../services/fakeDb";
import { Markup } from "interweave";

export default function Rci({ task, setTask }) {
  const { rci = [] } = task,
    { Preferences } = Cellcount,
    { Category } = RCI;

  const handleChange = e => {
    const { name, value } = e.target,
      _name = Number(name),
      _value = Number(value),
      _rci = [...rci];

    _rci[_name] = _name === 2 ? parseInt(_value) : parseFloat(_value);

    while (_rci.length < 4) {
      _rci.push(0);
    }

    setTask({
      ...task,
      rci: _rci,
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
        {(!!rci.length ? rci : [0, 0, 0, 0]).map((value, index) => {
          const category = Category[index],
            { lo, hi, unit } = Preferences.rci[category];

          return (
            <tr key={`rci-${index}`}>
              <td className="py-1">{category}</td>
              <td className="py-1">
                <input
                  type="number"
                  style={{
                    color: value
                      ? value < lo
                        ? "red"
                        : value > hi && "red"
                      : "",
                  }}
                  name={index}
                  value={String(value)}
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
