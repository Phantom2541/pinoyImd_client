// Sections.jsx
import { MDBDatePicker } from "mdbreact";
import React from "react";

// Reusable checkbox row
const CheckboxRow = ({ label, checked, onClick, style = {} }) => (
  <div
    className="flex items-center gap-2 cursor-pointer text-sm mb-2"
    onClick={onClick}
  >
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "16px",
        height: "16px",
        border: "1.5px solid #000",
        fontSize: "12px",
        fontWeight: "bold",
        ...style,
      }}
    >
      {checked ? "✓" : ""}
    </div>
    <span style={{ marginLeft: "8px", fontSize: "20px" }}>{label}</span>
  </div>
);

// ----------------- FamilyRootSystem -----------------
export function FamilyRootSystem({ step, form, handleCheck }) {
  const sides = [
    {
      label: "Mother",
      items: step.items.Mother,
      align: "end",
      dx: -20,
      dir: -1,
    },
    {
      label: "Father",
      items: step.items.Father,
      align: "start",
      dx: 20,
      dir: 1,
    },
  ];

  const itemHeight = 40;
  const startY = 80;
  const rootX = 250;
  const height =
    Math.max(step.items.Mother.length, step.items.Father.length) * itemHeight +
    120;
  const getY = (i) => startY + i * itemHeight;

  return (
    <svg width="600" height={height}>
      {sides.map((side) => (
        <g key={side.label}>
          <text
            x={rootX + side.dx * 3}
            y={40}
            textAnchor={side.align}
            fontWeight="bold"
            fontSize="19"
          >
            {side.label}
          </text>

          {side.items.map((item, i) => {
            const y = getY(i);
            const key = `${side.label}`;
            const value = form?.familyHistory[key] || [];
            const checked = Array.isArray(value) ? value.includes(item) : false;

            return (
              <g
                key={i}
                style={{ cursor: "pointer" }}
                onClick={() => handleCheck(key, item, !checked)}
              >
                <text
                  x={rootX + side.dx}
                  y={y}
                  textAnchor={side.align}
                  fontSize="17"
                >
                  {item}
                </text>

                {checked && (
                  <>
                    <line
                      x1={rootX}
                      y1={20}
                      x2={rootX}
                      y2={y - 5}
                      stroke="red"
                      strokeWidth={2}
                    />
                    <line
                      x1={rootX}
                      y1={y - 1}
                      x2={rootX + side.dir * 120}
                      y2={y - 1}
                      stroke="red"
                      strokeWidth={2}
                    />
                  </>
                )}
              </g>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

// ----------------- ChecklistSection -----------------
export function ChecklistSection({
  step,
  form,
  handleCheck,
  handleTextChange,
  handleFrequency,
}) {
  const frequencies = ["Daily", "Once a week", "Twice a week", "Occasional"];
  const keys = {
    PSHx: "surgeries",
    PMHx: "conditions",
    socialHistory: "habits",
  };
  const baseKey = keys[step.code];

  return (
    <div>
      {step.items.map((item) => {
        let checked = false;
        let value = "";

        // if (step.code === "PSHx") {
        //   const surgeriesObj = form.surgeries || {};
        //   checked = surgeriesObj.hasOwnProperty(item.label);
        //   value = surgeriesObj[item.label] || "";
        // } else {
        checked = Object.keys(form[baseKey] || {}).includes(item.label);
        value = form[baseKey]?.[item.label] || "";
        // }

        const freq = form[baseKey]?.[item.label] || "";

        return (
          <div key={item.label} className="mb-3">
            <CheckboxRow
              label={item.label}
              checked={checked}
              onClick={() => handleCheck(baseKey, item.label, !checked)}
              style={{ marginLeft: "150px" }}
            />

            {/* PMHx & PSHx → show textbox */}
            {checked && ["PMHx", "PSHx"].includes(step.code) && (
              <div style={{ marginLeft: "10.9rem" }}>
                <input
                  type="text"
                  value={value.split("-")[0] || ""}
                  onChange={(e) =>
                    handleTextChange(
                      baseKey,
                      item.label,
                      "details",
                      e.target.value
                    )
                  }
                  placeholder="Enter details"
                  className="border px-2 py-1 mb-1"
                />

                <MDBDatePicker
                  valueDefault={value.split("-")[1] || new Date()}
                  getValue={(val) =>
                    handleTextChange(baseKey, item.label, "date", val)
                  }
                  className="mt-1"
                  style={{ width: "10rem" }}
                />
              </div>
            )}

            {/* socialHistory → show frequency choices */}
            {checked && step.code === "socialHistory" && (
              <div style={{ marginLeft: "200px", marginTop: "4px" }}>
                {frequencies.map((f) => (
                  <CheckboxRow
                    key={f}
                    label={f}
                    checked={freq === f}
                    onClick={() =>
                      handleFrequency(baseKey, item.label, f, freq === f)
                    }
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ----------------- ObGyneSection -----------------
export function ObGyneSection({ step, form, handleCheck, handleNumber }) {
  const selected = form[step.code]?.selected || "";

  return (
    <>
      {step.items.map((item) => {
        const isChecked = selected === item.label;

        return (
          <div key={item.label} className="mb-2">
            <CheckboxRow
              label={item.label}
              checked={isChecked}
              onClick={() => handleCheck(step.code, item.label, !isChecked)}
              style={{ marginLeft: "150px" }}
            />

            {item.label === "Multigravida" && isChecked && item.children && (
              <div className="grid grid-cols-2 gap-2 ml-6 mt-2">
                {item.children.map((field) => (
                  <label key={field} className="block text-sm">
                    {field}:{" "}
                    <input
                      type="number"
                      min="0"
                      className="border p-1 w-20"
                      value={form[step.code]?.[field] || ""}
                      onChange={(e) =>
                        handleNumber(step.code, field, e.target.value)
                      }
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}
