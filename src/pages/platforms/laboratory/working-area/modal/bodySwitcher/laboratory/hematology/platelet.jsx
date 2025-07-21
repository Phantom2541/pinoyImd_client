import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetTASK } from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";

export default function Platelet({ activeTab }) {
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
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("task-post-btn").click();
    }
  };

  const { apc } = task;

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
          <td className="py-1">Platelet Count</td>
          <td className="py-1">
            <input
              ref={inputRef}
              type="number"
              style={{
                color: apc < 150 || apc > 400 ? "red" : undefined,
              }}
              value={String(apc)}
              autoFocus
              onChange={handleChange}
              onKeyDown={handleKeyDown} // 👈 Added
              className="w-100 text-center fw-bold"
            />
          </td>
          <td className="py-1">
            150-450 <sup>9</sup>/L
          </td>
        </tr>
      </tbody>
    </MDBTable>
  );
}
