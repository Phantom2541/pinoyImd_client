import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import { Markup } from "interweave";
import { Echo } from "../../../../../../../../services/fakeDb";

export default function MMode({ setActiveTab = () => {}, activeTab = "" }) {
  const { task, showModal } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();

  // pull array or default
  const mmodeValues = Array.isArray(task?.mmode) ? task.mmode : [];

  // refs for inputs
  const inputRefs = useRef([]);

  // auto-focus when modal opens
  useEffect(() => {
    if (showModal && activeTab === "MMode") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 400);
    }
  }, [showModal, activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const index = Number(name);

    const numericValue = value === "" ? "" : parseFloat(value);

    // clone and pad to match Echo.Mmode length
    const updated = [...mmodeValues];
    updated[index] = numericValue;

    // ensure full length
    const padded = Array(Echo.Mmode.length)
      .fill("")
      .map((_, i) => updated[i] ?? "");

    const newTask = {
      ...task,
      mmode: padded,
    };

    dispatch(SetTASK({ form: task?.form, task: newTask }));
    dispatch(SetPARAMS({ key: "mmode", value: padded }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      } else {
        setActiveTab("Volumes"); // move to next tab
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
        {Echo.Mmode.map((field, index) => {
          const val = mmodeValues[index] ?? "";
          return (
            <tr key={`echo-mmode-${index}`}>
              <td className="py-1">{field.title}</td>
              <td className="py-1">
                <input
                  type="number"
                  ref={(el) => (inputRefs.current[index] = el)}
                  name={index}
                  value={val}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="sectInput w-100 text-center fw-bold"
                />
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
