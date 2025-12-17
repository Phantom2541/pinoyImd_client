import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import {
  Microexam,
  PhysicalExam,
} from "../../../../../../../../services/fakeDb";
import MicroscopicInRange from "../../../../../../../../services/fakeDb/diagnostics/microscopicInRange";

// Unified config for select dropdowns
const MicroSelectOptions = {
  Agglutination: ["None", "Slight", "Moderate", "Severe"],
  "Pus cells": MicroscopicInRange,
  "Red Blood cells": MicroscopicInRange,
  "Epithelial cells": MicroscopicInRange,
};

export default function MicroExam({ activeTab = "", setActiveTab = () => {} }) {
  const { task } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();

  // default to array instead of fixed object
  const { me = new Array(Microexam.Category.length).fill("") } = task;

  const inputRefs = useRef([]);

  useEffect(() => {
    if (activeTab === "MICROSCOPIC EXAM") inputRefs.current[0]?.focus();
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const index = Number(name);

    const updated = [...me];
    updated[index] = value;

    dispatch(SetTASK({ form: task?.form, task: { ...task, me: updated } }));
    dispatch(SetPARAMS({ key: "me", value: updated }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        if (nextInput.select) nextInput.select();
      } else {
        if (task?.packages?.includes(59)) {
          setActiveTab("PLATELET");
        } else {
          setActiveTab("RCI");
        }
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
        {Microexam.Category.map((category, index) => {
          const pref = PhysicalExam.Preferences.semen[category] || {};
          const { lo = "", hi = "", unit = "" } = pref;

          const value = me[index] ?? "";

          let color = "";
          if (value !== "" && !isNaN(value)) {
            if (lo !== "" && !isNaN(lo) && value < lo) color = "blue";
            else if (hi !== "" && !isNaN(hi) && value > hi) color = "red";
          }

          const selectOptions = MicroSelectOptions[category];

          return (
            <tr key={`micro-${index}`}>
              <td className="py-1">{category}</td>
              <td className="py-1">
                {selectOptions ? (
                  <select
                    ref={(el) => (inputRefs.current[index] = el)}
                    name={String(index)}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="sectInput w-100 text-center fw-bold"
                  >
                    <option value="">-- Select --</option>
                    {selectOptions.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    ref={(el) => (inputRefs.current[index] = el)}
                    style={{ color }}
                    name={String(index)}
                    value={String(value)}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="sectInput w-100 text-center fw-bold"
                  />
                )}
              </td>
              <td className="py-1">
                {lo !== "" || hi !== "" ? (
                  <>
                    {lo && `>${lo}`} {hi && `- ${hi}`} {unit}
                  </>
                ) : (
                  <span className="text-muted">{unit || ""}</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
}
