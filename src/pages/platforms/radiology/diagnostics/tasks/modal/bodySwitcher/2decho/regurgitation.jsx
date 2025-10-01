import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import { Echo } from "../../../../../../../../services/fakeDb";

export default function Regurgitation({
  setActiveTab = () => {},
  activeTab = "",
}) {
  const { task, showModal } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();

  // pull array or default
  const regurValues = Array.isArray(task?.regur) ? task.regur : [];

  // refs for inputs
  const inputRefs = useRef([]);

  // auto-focus when modal opens
  useEffect(() => {
    if (showModal && activeTab === "Regurgitation") {
      setTimeout(() => {
        inputRefs.current?.[0]?.[0]?.focus();
      }, 400);
    }
  }, [showModal, activeTab]);

  const handleChange = (value, index, cIdx) => {
    const numericValue = value === "" ? "" : parseFloat(value);

    // clone and pad to match Echo.Regurgitation length
    const updated = [...regurValues];
    updated[index] = Array.isArray(updated[index]) ? [...updated[index]] : [];

    updated[index][cIdx] = numericValue;

    const newTask = {
      ...task,
      regur: updated,
    };
    // ensure full length
    const padded = Array(Echo.Regurgitation.length) // number of rows
      .fill("")
      .map((_, i) =>
        Array(3)
          .fill("")
          .map((__, j) =>
            Array.isArray(updated[i]) ? updated[i][j] ?? "" : ""
          )
      );

    dispatch(SetTASK({ form: task?.form, task: newTask }));
    dispatch(SetPARAMS({ key: "regur", value: padded }));
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
        setActiveTab("Tissue"); // move to next tab
      }
    }
  };
  return (
    <MDBTable hover responsive className="mb-0" small>
      <tbody>
        {Echo.Regurgitation.map((regur, index) => (
          <tr key={index}>
            <td>{regur}</td>
            {new Array(3).fill("").map((_, cIdx) => (
              <td>
                <input
                  type="number"
                  ref={(el) => {
                    if (!inputRefs.current[index]) {
                      inputRefs.current[index] = [];
                    }
                    inputRefs.current[index][cIdx] = el;
                  }}
                  name={index}
                  value={
                    Array.isArray(regurValues[index])
                      ? regurValues[index][cIdx] ?? ""
                      : ""
                  }
                  onChange={(e) => handleChange(e.target.value, index, cIdx)}
                  onKeyDown={(e) => handleKeyDown(e, index, cIdx)}
                  className="w-100 sectInput text-center fw-bold"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </MDBTable>
  );
}
