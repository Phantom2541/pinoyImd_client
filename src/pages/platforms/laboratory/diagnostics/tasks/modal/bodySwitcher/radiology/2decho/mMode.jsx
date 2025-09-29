import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import { Markup } from "interweave";
import { Echo } from "../../../../../../../../../services/fakeDb";

export default function TwoDEchoMMode({
  setActiveTab = () => {},
  activeTab = "",
}) {
  const { task, selected, showModal } = useSelector(
    ({ validator }) => validator
  );
  const dispatch = useDispatch();

  // 2D Echo Echo.Mmode (M-Mode + Volumes section only)
  const { echo = [] } = task;

  // Input refs
  const inputRefs = useRef([]);

  // Autofocus if modal opens
  useEffect(() => {
    if (showModal && activeTab === "2D ECHO") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 400);
    }
  }, [showModal, activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const index = Number(name);
    const updated = [...echo];
    updated[index] = value;

    dispatch(SetTASK({ form: task?.form, task: { ...task, echo: updated } }));
    dispatch(SetPARAMS({ key: "echo", value: updated }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      } else {
        setActiveTab("DOPPLER"); // go to next tab
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
        {(!!echo.length ? echo : Array(Echo.Mmode.length).fill("")).map(
          (val, index) => {
            const { title, range } = Echo.Mmode[index];
            return (
              <tr key={`echo-${index}`}>
                <td className="py-1">{title}</td>
                <td className="py-1">
                  <input
                    type="text"
                    ref={(el) => (inputRefs.current[index] = el)}
                    name={index}
                    value={val}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="sectInput w-100 text-center fw-bold"
                  />
                </td>
                <td className="py-1">
                  <Markup content={range} />
                </td>
              </tr>
            );
          }
        )}
      </tbody>
    </MDBTable>
  );
}
