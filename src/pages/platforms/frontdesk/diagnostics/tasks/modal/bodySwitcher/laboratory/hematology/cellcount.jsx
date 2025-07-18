import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import { Cellcount as CellCount } from "./../../../../../../../../../services/fakeDb";
import { Markup } from "interweave";

export default function Cellcount({ setActiveTab = () => {}, activeTab = "" }) {
  const { task, selected, showModal } = useSelector(
      ({ validator }) => validator
    ),
    dispatch = useDispatch();

  const { cc = [] } = task,
    { Preferences, Abbreviation, Title } = CellCount;

  // 1. Create array of refs for inputs
  const inputRefs = useRef([]);

  // 2. Focus on first input when mounted
  useEffect(() => {
    if (showModal && activeTab === "CELL COUNT") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 400);
    }
  }, [showModal, activeTab]);
  const handleChange = (e) => {
    const { name, value } = e.target,
      _name = Number(name),
      _cells = [...cc];
    _cells[_name] = value;
    if (!_name) {
      _cells[1] = parseFloat((Number(value) * 340).toFixed(0));
      _cells[2] = parseFloat((Number(value) * 11).toFixed(2));
    }
    while (_cells.length < 4) {
      _cells.push(0);
    }
    dispatch(SetTASK({ form: task?.form, task: { ...task, cc: _cells } }));
    dispatch(SetPARAMS({ key: "cc", value: _cells }));
  };
  console.log("selected", selected);
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      console.log("index", index);
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      } else {
        setActiveTab("DIFF COUNT");
      }
    }
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
            Preferences[selected.customerId.isMale ? "Male" : "Female"][
              Abbreviation[index]
            ];

          return (
            <tr key={`cell-${index}`}>
              <td className="py-1">{Title[index]}</td>
              <td className="py-1">
                <input
                  type="number"
                  ref={(el) => (inputRefs.current[index] = el)}
                  style={{
                    color: cell
                      ? cell < lo
                        ? "red"
                        : cell > hi
                        ? "red"
                        : ""
                      : "",
                  }}
                  name={index}
                  value={String(cell)}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
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
