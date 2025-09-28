import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import { Markup } from "interweave";
import { Echo } from "../../../../../../../../services/fakeDb";

export default function Regurgitation({
  setActiveTab = () => {},
  activeTab = "",
}) {
  const { task, showModal } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();

  // pull array or default
  const regurValues = Array.isArray(task?.eco?.regur) ? task.eco.regur : [];

  // refs for inputs
  const inputRefs = useRef([]);

  // auto-focus when modal opens
  useEffect(() => {
    if (showModal && activeTab === "Regurgitation") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 400);
    }
  }, [showModal, activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const index = Number(name);

    const numericValue = value === "" ? "" : parseFloat(value);

    // clone and pad to match Echo.Regurgitation length
    const updated = [...regurValues];
    updated[index] = numericValue;

    // ensure full length
    const padded = Array(Echo.Regurgitation.length)
      .fill("")
      .map((_, i) => updated[i] ?? "");

    const newTask = {
      ...task,
      eco: {
        ...task.eco,
        regur: padded,
      },
    };

    dispatch(SetTASK({ form: task?.form, task: newTask }));
    dispatch(SetPARAMS({ key: "eco.regur", value: padded }));
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
      <tbody>
        <tr>
          <td>TRUCUSPID REGURGITATION</td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
        </tr>
        <tr>
          <td>MITRAL REGURGITATION</td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
        </tr>
        <tr>
          <td>AORTIC/LVOT REGURGITATION</td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
        </tr>
        <tr>
          <td>PULMONIC REGURGITATION</td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
}
