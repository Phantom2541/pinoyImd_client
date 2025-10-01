import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import { Echo } from "../../../../../../../../services/fakeDb";

export default function Flow({ setActiveTab = () => {}, activeTab = "" }) {
  const { task, showModal } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();

  // pull array or default
  const flowValues = Array.isArray(task?.flow) ? task.flow : [];

  // refs for inputs
  const inputRefs = useRef([]);

  // auto-focus when modal opens
  useEffect(() => {
    if (showModal && activeTab === "Flow") {
      setTimeout(() => {
        inputRefs.current?.[0]?.[0]?.focus();
      }, 400);
    }
  }, [showModal, activeTab]);

  const handleChange = (value, index, cIdx) => {
    const numericValue = value === "" ? "" : parseFloat(value);

    // clone and pad to match Echo.FlowDoppler length
    const updated = [...flowValues];
    updated[index] = Array.isArray(updated[index]) ? [...updated[index]] : [];

    updated[index][cIdx] = numericValue;

    const newTask = {
      ...task,
      flow: updated,
    };
    // ensure full length
    const padded = Array(Echo.FlowDoppler.length) // number of rows
      .fill("")
      .map((_, i) =>
        Array(7) // 7 columns
          .fill("")
          .map((__, j) =>
            Array.isArray(updated[i]) ? updated[i][j] ?? "" : ""
          )
      );

    dispatch(SetTASK({ form: task?.form, task: newTask }));
    dispatch(SetPARAMS({ key: "eco.flow", value: padded }));
  };

  const handleKeyDown = (e, rowIdx, colIdx) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // hanapin next input (col muna, tapos row)
      const nextCol = colIdx + 1;
      if (inputRefs.current[rowIdx]?.[nextCol]) {
        inputRefs.current[rowIdx][nextCol].focus();
        inputRefs.current[rowIdx][nextCol].select();
      } else if (inputRefs.current[rowIdx + 1]?.[0]) {
        inputRefs.current[rowIdx + 1][0].focus();
        inputRefs.current[rowIdx + 1][0].select();
      } else {
        setActiveTab("Regurgitation"); // move to next tab
      }
    }
  };

  return (
    <MDBTable small responsive bordered>
      <thead>
        <tr>
          <th className="py-1" rowSpan={2}>
            Valve
          </th>
          <th className="py-1" rowSpan={2}>
            Vmax (m/s)
          </th>
          <th className="py-1" rowSpan={2}>
            Peak Gradient (mmHg)
          </th>
          <th className="py-1" rowSpan={2}>
            Mean Gradient (mmHg)
          </th>
          <th className="py-1" rowSpan={2}>
            Vti (cm)
          </th>
          <th className="py-1" colSpan={3}>
            Reguritation
          </th>
        </tr>
        <tr>
          <th className="py-1">Vti (cm)</th>
          <th className="py-1">Vmax (m/s)</th>
          <th className="py-1">VC (mm)</th>
        </tr>
      </thead>
      <tbody>
        {Echo.FlowDoppler.map((_, index) => {
          return (
            <tr key={index}>
              <td
                className="py-1 text-nowrap text-left"
                style={{ fontWeight: 400 }}
              >
                {Echo.FlowDoppler[index]}
              </td>
              {new Array(7).fill("").map((_, i) => (
                <td className="py-1" key={`${index}-${i}`}>
                  <input
                    type="number"
                    name={index}
                    style={{ width: "7rem" }}
                    value={
                      Array.isArray(flowValues[index])
                        ? flowValues[index][i] ?? ""
                        : ""
                    }
                    onChange={({ target }) =>
                      handleChange(target.value, index, i)
                    }
                    onKeyDown={(e) => handleKeyDown(e, index, i)}
                    ref={(el) => {
                      if (!inputRefs.current[index]) {
                        inputRefs.current[index] = [];
                      }
                      inputRefs.current[index][i] = el;
                    }}
                  />
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
}
