import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import { PhysicalExam } from "../../../../../../../../../services/fakeDb";
import { Markup } from "interweave";

export default function Physicalexam({
  setActiveTab = () => {},
  activeTab = "",
}) {
  const { task, showModal } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();

  const { cc = [] } = task;
  const { Preferences, Abbreviation, Title } = PhysicalExam;

  // refs for inputs
  const inputRefs = useRef([]);

  // focus first input when modal opens
  useEffect(() => {
    if (showModal && activeTab === "PHYSICAL EXAM") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 400);
    }
  }, [showModal, activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const _name = Number(name);
    const _cells = [...cc];
    _cells[_name] = value;

    // auto compute first values if index is 0
    if (_name === 0) {
      _cells[1] = parseFloat((Number(value) * 340).toFixed(0));
      _cells[2] = parseFloat((Number(value) * 11).toFixed(2));
    }

    while (_cells.length < Abbreviation.length) {
      _cells.push(0);
    }

    dispatch(SetTASK({ form: task?.form, task: { ...task, cc: _cells } }));
    dispatch(SetPARAMS({ key: "cc", value: _cells }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      } else {
        setActiveTab("MICROSCOPIC EXAM");
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
        {(!!cc.length ? cc : new Array(Abbreviation.length).fill(0)).map(
          (cell, index) => {
            const abbr = Abbreviation[index]; // e.g. "te", "lf", "vol"
            const pref = Preferences.physical[abbr] || {};
            const { lo = "", hi = "", unit = "" } = pref;

            let color = "";
            if (!isNaN(cell) && lo !== "" && hi !== "") {
              if (cell < lo) color = "blue";
              else if (cell > hi) color = "red";
            }

            return (
              <tr key={`cell-${index}`}>
                <td className="py-1">{Title[index] || abbr}</td>
                <td className="py-1">
                  <input
                    type="number"
                    ref={(el) => (inputRefs.current[index] = el)}
                    style={{ color }}
                    name={index}
                    value={String(cell)}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="sectInput w-100 text-center fw-bold"
                  />
                </td>
                <td className="py-1">
                  {lo !== "" && hi !== "" ? (
                    <>
                      {lo} - {hi} <Markup content={unit} />
                    </>
                  ) : (
                    <span className="text-muted"></span>
                  )}
                </td>
              </tr>
            );
          }
        )}
      </tbody>
    </MDBTable>
  );
}
