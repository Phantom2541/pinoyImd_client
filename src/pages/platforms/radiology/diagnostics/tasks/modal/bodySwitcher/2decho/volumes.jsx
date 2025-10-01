import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import { Markup } from "interweave";
import { Echo } from "../../../../../../../../services/fakeDb";

export default function Volumes({ setActiveTab = () => {}, activeTab = "" }) {
  const { task, showModal } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();

  // pull array or default
  const volumeValues = Array.isArray(task?.volume) ? task.volume : [];

  // refs for inputs
  const inputRefs = useRef([]);

  // auto-focus when modal opens
  useEffect(() => {
    if (showModal && activeTab === "Volumes") {
      setTimeout(() => {
        inputRefs.current?.[0]?.[0]?.focus();
      }, 400);
    }
  }, [showModal, activeTab]);

  const handleChange = (value, index, cIdx) => {
    const numericValue = value === "" ? "" : parseFloat(value);

    const updated = [...volumeValues];
    updated[index] = Array.isArray(updated[index]) ? [...updated[index]] : [];

    // dito na tayo mag-assign safely
    updated[index][cIdx] = numericValue;

    // ensure full length
    const padded = Array(Echo.Volumes.length)
      .fill("")
      .map((_, i) => updated[i] ?? "");

    const newTask = {
      ...task,
      volume: padded,
    };

    dispatch(SetTASK({ form: task?.form, task: newTask }));
    dispatch(SetPARAMS({ key: "volume", value: padded }));
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
        setActiveTab("Parameters"); // move to next tab
      }
    }
  };

  return (
    <MDBTable hover responsive className="mb-0">
      <thead>
        <tr>
          <th className="py-1">Parameter</th>
          <th className="py-1">Value</th>
          <th className="py-1">Reference</th>
        </tr>
      </thead>
      <tbody>
        {Echo.Volumes.map((field, index) => {
          const val = volumeValues[index] ?? [];
          return (
            <tr key={`echo-volume-${index}`}>
              <td className="py-1">{field.title}</td>
              <td className="py-1">
                <div className="d-flex">
                  {new Array(2).fill(0).map((_, i) => (
                    <input
                      key={`echo-volume-${index}-${i}`}
                      type="number"
                      ref={(el) => {
                        if (!inputRefs.current[index]) {
                          inputRefs.current[index] = [];
                        }
                        inputRefs.current[index][i] = el;
                      }}
                      name={index}
                      value={val[i] ?? ""}
                      onChange={({ target }) =>
                        handleChange(target.value, index, i)
                      }
                      onKeyDown={(e) => handleKeyDown(e, index, i)}
                      className="sectInput w-100 text-center fw-bold mr-1"
                    />
                  ))}
                </div>
              </td>
              <td className="py-1">
                <Markup content={field.range} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
}
