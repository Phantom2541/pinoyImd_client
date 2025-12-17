import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import {
  Diffcount as DiffCount,
  Cellcount,
} from "./../../../../../../../../services/fakeDb";
import preferences from "../../../../../../../../services/fakeDb/diagnostics/references";

const devGroups = {
  adult: [
    "Young Adult",
    "Adult",
    "Middle Aged",
    "Senior",
    "Elderly",
    "Geriatric",
  ],
  child: ["Child", "Pre-Teen", "Teenager"],
  infant: ["Toddler", "Infant"],
  neonate: ["Neonatal", "Fetal"],
};
const _dc = {
  a: 0,
  b: 0,
  c: 0,
  d: 0,
  e: 0,
  f: 0,
};

export default function Diffcount({ activeTab = "", setActiveTab = () => {} }) {
  const { task, selected = {} } = useSelector(({ validator }) => validator),
    dispatch = useDispatch();

  const { dc = _dc } = task,
    { Conventionals } = Cellcount,
    { Category } = DiffCount;
  const dob = selected?.customerId?.dob;
  const devString = preferences.getDevelopmentByBirthDate(dob).name;
  const development =
    Object.entries(devGroups).find(([, arr]) => arr.includes(devString))?.[0] ||
    "neonate";

  const inputRefs = useRef([]);

  // Focus on first input when component mounts
  useEffect(() => {
    if (activeTab === "DIFF COUNT") inputRefs.current[0]?.focus();
  }, [activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target,
      _value = parseInt(value),
      diff = { ...dc };

    diff[name] = _value;
    // Calculate total
    const total = Object.values(diff).reduce(
      (sum, val) => sum + (parseInt(val) || 0),
      0
    );
    // Dispatch state update
    dispatch(SetTASK({ form: task?.form, task: { ...task, dc: diff } }));
    dispatch(SetPARAMS({ key: "dc", value: diff }));

    // Check if total reached 100
    if (total >= 100) {
      if (task?.packages?.includes(59)) {
        setActiveTab("PLATELET");
      } else {
        setActiveTab("RCI");
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      } else {
        // Check if PLATELET tab is available in task.packages
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
        {Object.entries(dc).map(([key, value], index) => {
          const category = Category[index],
            { lo, hi } = Conventionals.differentials[category][development];

          return (
            <tr key={`diff-${index}`}>
              <td className="py-1">{category}</td>
              <td className="py-1">
                <input
                  type="number"
                  name={key}
                  value={String(value)}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-100 text-center fw-bold"
                  style={{
                    color: value
                      ? value < lo
                        ? "blue"
                        : value > hi
                        ? "red"
                        : ""
                      : "",
                  }}
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
