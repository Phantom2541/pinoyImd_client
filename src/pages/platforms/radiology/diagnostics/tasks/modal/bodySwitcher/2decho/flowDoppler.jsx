import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import { Markup } from "interweave";
import { Echo } from "../../../../../../../../services/fakeDb";

export default function Flow({ setActiveTab = () => {}, activeTab = "" }) {
  const { task, showModal } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();

  // pull array or default
  const flowValues = Array.isArray(task?.eco?.flow) ? task.eco.flow : [];

  // refs for inputs
  const inputRefs = useRef([]);

  // auto-focus when modal opens
  useEffect(() => {
    if (showModal && activeTab === "Flow") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 400);
    }
  }, [showModal, activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const index = Number(name);

    const numericValue = value === "" ? "" : parseFloat(value);

    // clone and pad to match Echo.FlowDoppler length
    const updated = [...flowValues];
    updated[index] = numericValue;

    // ensure full length
    const padded = Array(Echo.FlowDoppler.length)
      .fill("")
      .map((_, i) => updated[i] ?? "");

    const newTask = {
      ...task,
      eco: {
        ...task.eco,
        flow: padded,
      },
    };

    dispatch(SetTASK({ form: task?.form, task: newTask }));
    dispatch(SetPARAMS({ key: "eco.flow", value: padded }));
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
    <table className="mb-0 table table-hover table-responsive">
      <thead>
        <tr>
          <th className="py-1">Valve</th>
          <th className="py-1">Vmax(m/s)</th>
          <th className="py-1">Peak Gradient (mmHg)</th>
          <th className="py-1">Mean Gradient (mmHg)</th>
          <th className="py-1">Vti(cm)</th>
          <th className="py-1" colSpan="3">
            Reguritation
          </th>
        </tr>
        <tr>
          <th className="py-1" colSpan="5" />
          <th className="py-1">Vti (cm)</th>
          <th className="py-1">Vmax (m/s)</th>
          <th className="py-1">VC (mm)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>TRICUSPID</td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
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
          <td>MITRAL</td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
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
          <td>AORTIC</td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
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
          <td>PULMONIC</td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
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
          <td>{`PAT=(NV>10)`}</td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
          <td>
            <input type="number" />
          </td>
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
    </table>
  );
}
