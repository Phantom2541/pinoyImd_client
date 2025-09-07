import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import {
  Microexam,
  PhysicalExam,
} from "../../../../../../../../../services/fakeDb";
const _dc = {
  a: 0,
  b: 0,
  c: 0,
  d: 0,
  e: 0,
  f: 0,
  g: 0,
  h: 0,
  i: 0,
  j: 0,
};

export default function MicroExam({ activeTab = "", setActiveTab = () => {} }) {
  const { task } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();

  const { dc = _dc } = task;

  const inputRefs = useRef([]);

  // Focus on first input when component mounts
  useEffect(() => {
    if (activeTab === "MICROSCOPIC EXAM") inputRefs.current[0]?.focus();
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const _value = parseInt(value) || 0;
    const diff = { ...dc, [name]: _value };

    dispatch(SetTASK({ form: task?.form, task: { ...task, dc: diff } }));
    dispatch(SetPARAMS({ key: "dc", value: diff }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
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

          const value = dc[Object.keys(dc)[index]] || 0;

          let color = "";
          if (value) {
            if (lo !== "" && !isNaN(lo) && value < lo) color = "blue";
            else if (hi !== "" && !isNaN(hi) && value > hi) color = "red";
          }

          return (
            <tr key={`diff-${index}`}>
              <td className="py-1">{category}</td>
              <td className="py-1">
                <input
                  type="number"
                  name={Object.keys(dc)[index]}
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
                    {lo && `>${lo}`} {hi && ` - ${hi}`} {unit}
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
