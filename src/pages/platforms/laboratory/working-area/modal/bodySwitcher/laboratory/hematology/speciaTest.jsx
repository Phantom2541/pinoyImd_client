import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";

const _troupe = {
  retic: 0,
  esr: 0,
};

export default function SpecialTest({ activeTab = "" }) {
  const dispatch = useDispatch();
  const { task } = useSelector(({ validator }) => validator);
  const { troupe = _troupe, packages = [] } = task;

  const inputRefs = useRef({
    retic: null,
    esr: null,
  });

  // Auto-focus Reticulocyte or ESR input depending on availability
  useEffect(() => {
    if (activeTab === "SPECIAL TEST") {
      if (packages.includes(62)) {
        inputRefs.current.retic?.focus();
      } else if (packages.includes(63)) {
        inputRefs.current.esr?.focus();
      }
    }
  }, [activeTab, packages]);

  const handleChange = (key, value) => {
    const updatedTroupe = { ...troupe, [key]: value };
    dispatch(
      SetTASK({ form: task?.form, task: { ...task, troupe: updatedTroupe } })
    );
    dispatch(SetPARAMS({ key: "troupe", value: updatedTroupe }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      document.getElementById("task-post-btn")?.click();
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
        {packages.includes(62) && (
          <tr>
            <td className="py-1">Reticulocytes</td>
            <td className="py-1">
              <input
                type="number"
                ref={(el) => (inputRefs.current.retic = el)}
                onKeyDown={handleKeyDown}
                value={troupe.retic}
                onChange={(e) => handleChange("retic", e.target.value)}
                className="w-100 text-center fw-bold"
              />
            </td>
            <td className="py-1">0.5–1.5%</td>
          </tr>
        )}
        {packages.includes(63) && (
          <tr>
            <td className="py-1">ESR</td>
            <td className="py-1">
              <input
                type="number"
                ref={(el) => (inputRefs.current.esr = el)}
                onKeyDown={handleKeyDown}
                value={troupe.esr}
                onChange={(e) => handleChange("esr", e.target.value)}
                className="w-100 text-center fw-bold"
              />
            </td>
            <td className="py-1">0–15 mm/hr</td>
          </tr>
        )}
      </tbody>
    </MDBTable>
  );
}
