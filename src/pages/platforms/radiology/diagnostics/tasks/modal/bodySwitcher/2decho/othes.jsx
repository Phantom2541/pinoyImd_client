import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import { Echo } from "../../../../../../../../services/fakeDb";

export default function TissueDopler({
  setActiveTab = () => {},
  activeTab = "",
}) {
  const { task, showModal } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();

  // pull array or default
  const othersValues = Array.isArray(task?.others) ? task.others : [];

  // refs for inputs
  const inputRefs = useRef([]);

  // auto-focus when modal opens
  useEffect(() => {
    if (showModal && activeTab === "Others") {
      setTimeout(() => {
        inputRefs.current?.[0]?.[0]?.focus();
      }, 400);
    }
  }, [showModal, activeTab]);

  const handleChange = (value, index, cIdx) => {
    const numericValue = value === "" ? "" : parseFloat(value);

    // clone and pad to match Echo.tissue length
    const updated = [...othersValues];
    updated[index] = Array.isArray(updated[index]) ? [...updated[index]] : [];

    updated[index][cIdx] = numericValue;

    const newTask = {
      ...task,
      others: updated,
    };
    // ensure full length
    const padded = Echo.Others.map((items, i) =>
      items.map((__, j) =>
        Array.isArray(updated[i]) ? updated[i][j] ?? "" : ""
      )
    );

    dispatch(SetTASK({ form: task?.form, task: newTask }));
    dispatch(SetPARAMS({ key: "others", value: padded }));
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
        setActiveTab("Others"); // move to next tab
      }
    }
  };

  return (
    <MDBTable responsive className="mb-0" small bordered>
      <thead>
        <tr>
          <th>TAPSE:</th>
          <th>VALUES</th>
          <th className="text-nowrap">LA VOLUME (BIPLANE) RESULT</th>
          <th>VALUES</th>
          <th>LV MASS & LV MASS INDEX</th>
        </tr>
      </thead>
      <tbody>
        {Echo.Others.map((items, rowIdx) => (
          <tr key={rowIdx}>
            {items.map((item, colIdx) => (
              <td key={colIdx}>
                <div className="d-flex align-items-center justify-content-between">
                  <span
                    className={`text-nowrap ${item ? "mr-2" : ""} `}
                    style={{ fontWeight: 400 }}
                  >
                    {item ? `${item}: ` : ""}
                  </span>
                  <input
                    type="number"
                    className="sectInput text-center fw-bold "
                    ref={(el) => {
                      if (!inputRefs.current[rowIdx]) {
                        inputRefs.current[rowIdx] = [];
                      }
                      inputRefs.current[rowIdx][colIdx] = el;
                    }}
                    value={
                      Array.isArray(othersValues[rowIdx])
                        ? othersValues[rowIdx][colIdx] ?? ""
                        : ""
                    }
                    style={{ width: item ? "7rem" : "100%" }}
                    onChange={(e) =>
                      handleChange(e.target.value, rowIdx, colIdx)
                    }
                    onKeyDown={(e) => handleKeyDown(e, rowIdx, colIdx)}
                  />
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </MDBTable>
  );
}
