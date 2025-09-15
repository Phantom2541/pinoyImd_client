// Sections.jsx
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
            const key = `${step.code}-${side.label}`;
            const checked = (form[key] || []).includes(item);

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
export function ChecklistSection({ step, form, handleCheck }) {
  return (
    <div>
      {step.items.map((item) => {
        const checked = (form[step.code] || []).includes(item.label);
        return (
          <CheckboxRow
            key={item.label}
            label={item.label}
            checked={checked}
            onClick={() => handleCheck(step.code, item.label, !checked)}
            style={{ marginLeft: "150px" }}
          />
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
            {/* Checkbox row */}
            <CheckboxRow
              label={item.label}
              checked={isChecked}
              onClick={() => handleCheck(step.code, item.label, !isChecked)}
              style={{ marginLeft: "150px" }}
            />

            {/* Show children inputs only when Multigravida is active */}
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
