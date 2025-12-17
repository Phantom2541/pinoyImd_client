import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SetPARAMS,
  SetTASK,
} from "../../../../../../../../services/redux/slices/diagnostics/laboratory/validator";
import { MDBTable } from "mdbreact";
import { PhysicalExam } from "../../../../../../../../services/fakeDb";
import { Markup } from "interweave";

export default function PhysicalExamTab({
  activeTab = "",
  setActiveTab = () => {},
}) {
  const { task, showModal } = useSelector(({ validator }) => validator);
  const dispatch = useDispatch();

  // default: object with abbreviation keys
  const { Abbreviation, Title, Preferences } = PhysicalExam;
  const defaultObj = Abbreviation.reduce((acc, key) => {
    acc[key] = "";
    return acc;
  }, {});

  const { pe = defaultObj } = task;

  const inputRefs = useRef([]);

  useEffect(() => {
    if (showModal && activeTab === "PHYSICAL EXAM") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 300);
    }
  }, [showModal, activeTab]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const updated = { ...pe, [name]: value };

    dispatch(SetTASK({ form: task?.form, task: { ...task, pe: updated } }));
    dispatch(SetPARAMS({ key: "pe", value: updated }));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
        if (nextInput.select) nextInput.select();
      } else {
        setActiveTab("MICROSCOPIC EXAM");
      }
    }
  };

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
        {Abbreviation.map((abbr, index) => {
          const category = Title[index] || abbr;
          const pref = Preferences.physical[abbr] || {};
          const { lo = "", hi = "", unit = "" } = pref;

          const value = pe[abbr] ?? "";

          let color = "";
          if (value !== "" && !isNaN(value)) {
            if (lo !== "" && !isNaN(lo) && value < lo) color = "blue";
            else if (hi !== "" && !isNaN(hi) && value > hi) color = "red";
          }

          // Fields that should be dropdowns
          const isSelect = ["Appearance", "Color", "Viscosity"].includes(
            category
          );

          return (
            <tr key={`physical-${abbr}`}>
              <td className="py-1">{category}</td>
              <td className="py-1">
                {isSelect ? (
                  <select
                    ref={(el) => (inputRefs.current[index] = el)}
                    name={abbr}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="sectInput w-100 text-center fw-bold"
                  >
                    <option value="">-- Select --</option>
                    {category === "Appearance" && (
                      <>
                        <option value="Normal">Normal</option>
                        <option value="Opaque">Opaque</option>
                        <option value="Clear">Clear</option>
                        <option value="Yellowish">Yellowish</option>
                      </>
                    )}
                    {category === "Color" && (
                      <>
                        <option value="Grayish">Grayish</option>
                        <option value="Whitish">Whitish</option>
                        <option value="Yellowish">Yellowish</option>
                        <option value="Reddish">Reddish</option>
                      </>
                    )}
                    {category === "Viscosity" && (
                      <>
                        <option value="Normal">Normal</option>
                        <option value="Increased">Increased</option>
                        <option value="Decreased">Decreased</option>
                      </>
                    )}
                  </select>
                ) : (
                  <input
                    type="number"
                    ref={(el) => (inputRefs.current[index] = el)}
                    style={{ color }}
                    name={abbr}
                    value={String(value)}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="sectInput w-100 text-center fw-bold"
                  />
                )}
              </td>
              <td className="py-1">
                {lo !== "" || hi !== "" ? (
                  <>
                    {lo} {hi && `- ${hi}`} <Markup content={unit} />
                  </>
                ) : (
                  <span className="text-muted">{unit || ""}</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </MDBTable>
  );
}
