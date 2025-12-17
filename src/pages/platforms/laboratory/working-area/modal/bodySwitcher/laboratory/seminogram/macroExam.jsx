import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import {
  Macroexam,
  PhysicalExam,
} from "../../../../../../../../services/fakeDb";

export default function Macro({ activeTab = "", setActiveTab = () => {} }) {
  const { task } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();

  // default to array with same length as Macroexam.Category
  const { mo = new Array(Macroexam.Category.length).fill(0) } = task;

  const inputRefs = useRef([]);

  useEffect(() => {
    if (activeTab === "MACROSCOPIC EXAM") {
      inputRefs.current[0]?.focus();
    }
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const index = Number(name);
    const _value = parseFloat(value) || 0;

    const updated = [...mo];
    updated[index] = _value;

    dispatch(SetTASK({ form: task?.form, task: { ...task, mo: updated } }));
    dispatch(SetPARAMS({ key: "mo", value: updated }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      } else {
        setActiveTab("CHEMICAL EXAM");
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
        {Macroexam.Category.map((category, index) => {
          const pref = PhysicalExam.Preferences.semen[category] || {};
          const { lo = "", hi = "", unit = "" } = pref;

          const value = mo[index] ?? "";

          let color = "";
          if (value !== "" && !isNaN(value)) {
            if (lo !== "" && !isNaN(lo) && value < lo) color = "blue";
            else if (hi !== "" && !isNaN(hi) && value > hi) color = "red";
          }

          return (
            <tr key={`macro-${index}`}>
              <td className="py-1">{category}</td>
              <td className="py-1">
                <input
                  type="number"
                  name={String(index)}
                  value={String(value)}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-100 text-center fw-bold"
                  style={{ color }}
                />
              </td>
              <td className="py-1">
                {lo !== "" || hi !== "" ? (
                  <>
                    {lo} {hi && `- ${hi}`} {unit}
                  </>
                ) : (
                  <span className="text-muted">{unit || "N/A"}</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
}
