import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetTASK } from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";

export default function ChemExam({ activeTab = "", setActiveTab = () => {} }) {
  const { task } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();
  const inputRef = useRef(null); // Reference to the input

  useEffect(() => {
    if (activeTab === "PLATELET") inputRef.current.focus();
  }, [activeTab]);

  const handleChange = (e) => {
    dispatch(
      SetTASK({
        form: task?.form,
        task: { ...task, apc: parseFloat(e.target.value) },
      })
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const packages = task?.packages || [];
      const hasRCI = packages.includes(58);

      if (hasRCI) setActiveTab("RCI");
      else document.getElementById("task-post-btn")?.click();
    }
  };

  const { ce } = task;

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
        <tr>
          <td className="py-1">Semen Fructose, Qualitative</td>
          <td className="py-1">
            <select
              name="ce"
              className="form-control"
              value={ce}
              onChange={handleChange}
              id="ce"
            >
              <option value="0">Negative</option>
              <option value="1">Positive</option>
            </select>
          </td>
          <td className="py-1"></td>
        </tr>
      </tbody>
    </MDBTable>
  );
}
