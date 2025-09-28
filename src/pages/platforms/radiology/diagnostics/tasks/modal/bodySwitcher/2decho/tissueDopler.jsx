import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import { Markup } from "interweave";
import { Echo } from "../../../../../../../../services/fakeDb";

export default function TissueDopler({
  setActiveTab = () => {},
  activeTab = "",
}) {
  const { task, showModal } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();

  // pull array or default
  const tissueValues = Array.isArray(task?.eco?.tissue) ? task.eco.tissue : [];

  // refs for inputs
  const inputRefs = useRef([]);

  // auto-focus when modal opens
  useEffect(() => {
    if (showModal && activeTab === "tissues") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 400);
    }
  }, [showModal, activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const index = Number(name);

    const numericValue = value === "" ? "" : parseFloat(value);

    // clone and pad to match Echo.tissue length
    const updated = [...tissueValues];
    updated[index] = numericValue;

    // ensure full length
    const padded = Array(Echo.TissueDoppler.length)
      .fill("")
      .map((_, i) => updated[i] ?? "");

    const newTask = {
      ...task,
      eco: {
        ...task.eco,
        tissue: padded,
      },
    };

    dispatch(SetTASK({ form: task?.form, task: newTask }));
    dispatch(SetPARAMS({ key: "eco.tissue", value: padded }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      } else {
        setActiveTab("tissues"); // move to next tab
      }
    }
  };

  return (
    <MDBTable hover responsive className="mb-0">
      <tbody>
        <tr>
          <td> TDI MEDIAL VELOCITY</td>
          <td>
            E: <input type="number" />
          </td>
          <td>
            A: <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
        </tr>
        <tr>
          <td> TDI LATERAL VELOCITY</td>
          <td>
            E: <input type="number" />
          </td>
          <td>
            A: <input type="number" />
          </td>
          <td>
            {" "}
            <input type="number" />
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
}
