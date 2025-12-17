import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import {
  MDBSelect,
  MDBSelectInput,
  MDBSelectOption,
  MDBSelectOptions,
  MDBTable,
} from "mdbreact";

const _troupe = {
  bt: [],
  ct: [],
};
const options = ["00", "15", "30", "45"];

export default function ClottingFactor({
  activeTab = "",
  setActiveTab = () => {},
}) {
  const dispatch = useDispatch();
  const inputRef = useRef(null); // Reference to the input
  const { task } = useSelector(({ validator }) => validator);
  const { troupe = _troupe, packages = [] } = task;
  useEffect(() => {
    if (activeTab === "CLOTTING FACTOR") inputRef.current.focus();
  }, [activeTab]);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const packages = task?.packages || [];

      const hasRetic = packages.includes(62);
      const hasESR = packages.includes(63);

      if (hasRetic || hasESR) {
        setActiveTab("SPECIAL TEST");
      } else {
        document.getElementById("task-post-btn")?.click();
      }
    }
  };

  const handleChange = (key, index, value) => {
    const arr = [...(troupe[key] || [])];
    arr[index] = value;
    const updatedTroupe = { ...troupe, [key]: arr };

    dispatch(
      SetTASK({ form: task?.form, task: { ...task, troupe: updatedTroupe } })
    );
    dispatch(SetPARAMS({ key: "troupe", value: updatedTroupe }));
  };

  const renderRow = (label, key, refRange) => {
    return (
      <tr>
        <td className="py-2 align-middle">{label}</td>
        <td className="py-2">
          <div className="d-flex gap-2 align-items-center">
            <input
              type="number"
              ref={key === "bt" ? inputRef : null}
              value={String(troupe[key]?.[0] || "")}
              onChange={(e) => handleChange(key, 0, Number(e.target.value))}
              onKeyDown={handleKeyDown} // 👈 Added
              className="form-control text-center fw-bold"
              style={{ maxWidth: "80px" }}
            />
            <span className="fw-bold">:</span>
            <MDBSelect
              getValue={(e) => handleChange(key, 1, Number(e[0]))}
              onKeyDown={handleKeyDown} // 👈 Added
              className="ml-2"
              style={{ maxWidth: "100px" }}
              search
            >
              <MDBSelectInput
                selected={
                  troupe[key]?.[1] !== undefined
                    ? `Seconds: ${options[troupe[key][1]]} sec.`
                    : "Select Seconds"
                }
              />
              <MDBSelectOptions>
                {options.map((option, index) => (
                  <MDBSelectOption key={`${key}-${index}`} value={index}>
                    {option} sec.
                  </MDBSelectOption>
                ))}
              </MDBSelectOptions>
            </MDBSelect>
          </div>
        </td>
        <td className="py-2 align-middle">{refRange}</td>
      </tr>
    );
  };

  return (
    <MDBTable hover responsive className="mb-0">
      <thead>
        <tr>
          <th className="py-2">Category</th>
          <th className="py-2">Result</th>
          <th className="py-2">Reference</th>
        </tr>
      </thead>
      <tbody>
        {packages.includes(60) && renderRow("Bleeding Time", "bt", "2–4 min")}
        {packages.includes(61) && renderRow("Clotting Time", "ct", "2–4 min")}
      </tbody>
    </MDBTable>
  );
}
