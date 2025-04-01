import React from "react";
import { MDBTable } from "mdbreact";
import {
  Diffcount as DiffCount,
  Cellcount,
} from "../../../../../../../../../../services/fakeDb";

const _dc = {
  a: 0,
  b: 0,
  c: 0,
  d: 0,
  e: 0,
  f: 0,
};

export default function Diffcount({ task, setTask }) {
  const { dc = _dc } = task,
    { Preferences } = Cellcount,
    { Category } = DiffCount;

  const handleChange = e => {
    const { name, value } = e.target,
      _value = parseInt(value),
      diff = { ...dc };

    diff[name] = _value;

    setTask({
      ...task,
      dc: diff,
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
        {Object.entries(dc).map(([key, value], index) => {
          const category = Category[index],
            { lo, hi } = Preferences.differentials[category];

          return (
            <tr key={`diff-${index}`}>
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
                  name={key}
                  value={String(value)}
                  onChange={handleChange}
                  className="w-100 text-center fw-bold"
                />
              </td>
              <td className="py-1">
                {lo} - {hi}
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
}
