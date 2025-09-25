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
        let details = "";
        let date = "";
        let freq = "";

        if (["PSHx", "PMHx"].includes(step.code)) {
          const arr = form[baseKey] || [];
          const entry = arr.find(
            (c) =>
              c.name?.toLowerCase().trim() === item.label.toLowerCase().trim()
          );
          checked = !!entry;
          details = entry?.details || "";
          date = entry?.date || "";
        } else if (step.code === "socialHistory") {
          const arr = form.habits || [];
          const entry = arr.find((h) => h.name === item.label);
          checked = !!entry;
          freq = entry?.freq || "";
        }

        return (
          <div key={item.label} className="mb-3">
            <CheckboxRow
              label={item.label}
              checked={checked}
              onClick={() => handleCheck(baseKey, item.label)}
              style={{ marginLeft: "150px" }}
            />

            {/* conditions & surgeries → details + date */}
            {checked && ["PMHx", "PSHx"].includes(step.code) && (
              <div style={{ marginLeft: "10.9rem" }}>
                <input
                  type="text"
                  value={details}
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
                  valueDefault={date || new Date()}
                  getValue={(val) =>
                    handleTextChange(baseKey, item.label, "date", val)
                  }
                  className="mt-1"
                  style={{ width: "10rem" }}
                />
              </div>
            )}

            {/* habits → frequency */}
            {checked && step.code === "socialHistory" && (
              <div style={{ marginLeft: "200px", marginTop: "4px" }}>
                {frequencies.map((f) => (
                  <CheckboxRow
                    key={f}
                    label={f}
                    checked={freq === f}
                    onClick={() => handleFrequency(item.label, f)}
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
export function ObGyneSection({ step, form, handleNumber, handleTextChange }) {
  const sectionData = form[step.code] || {};
  const gtpalData = sectionData.gtpal || {};

  const obGyneKeyMap = {
    "At what age did you have your first menstruation": "menarche",
    "When was your last menstrual period?": "lmp",
    "Are you currently using any method of contraception?": "contraception",
  };

  const gtpalItem = Array.isArray(step.items)
    ? step.items.find((item) => item.label.toLowerCase() === "gtpal")
    : null;
  console.log("gtpalItem", gtpalItem);

  const gtpalFieldMap = {
    "How many times have you been pregnant?": "gravida",
    "How many reached 9 months or full term?": "term",
    "Any preterm deliveries?": "preterm",
    "Any miscarriages or abortions?": "abortion",
    "How many living children?": "living",
  };

  return (
    <div className="space-y-4">
      {/* Regular labels with input */}
      {step.items
        ?.filter((item) => item.label.toLowerCase() !== "gtpal")
        .map((item) => {
          const key = obGyneKeyMap[item.label] || item.label;
          return (
            <div key={item.label} className="flex items-center mb-1">
              <label className="w-80 text-sm mb-1 mt-1">{item.label}</label>

              {key === "lmp" ? (
                <MDBDatePicker
                  valueDefault={sectionData.lmp || new Date()}
                  getValue={(val) =>
                    handleTextChange(step.code, "lmp", "date", val)
                  }
                  className="mt-1 mb-1"
                  style={{ width: "10rem" }}
                />
              ) : (
                <input
                  type={key === "menarche" ? "number" : "text"}
                  className="border ml-2 text-center"
                  style={{
                    width: key === "menarche" ? "5rem" : "8rem",
                  }}
                  value={sectionData[key] || ""}
                  onChange={(e) =>
                    key === "menarche"
                      ? handleNumber(step.code, key, e.target.value)
                      : handleTextChange(step.code, key, "text", e.target.value)
                  }
                />
              )}
            </div>
          );
        })}

      {/* GTPAL block */}
      {gtpalItem && (
        <div className="mt-1">
          {/* Inputs with labels */}
          <div className="flex flex-col gap-3">
            {gtpalItem.children.map((child) => {
              const key = gtpalFieldMap[child.label];

              return (
                <div key={key} className="flex items-center gap-2">
                  {/* show the label */}
                  <label className="w-64">{child.label}</label>

                  {/* input field */}
                  <input
                    type="number"
                    min="0"
                    className="border ml-2 text-center"
                    style={{ width: "5rem" }}
                    value={gtpalData[key] || ""}
                    onChange={(e) =>
                      handleNumber(step.code, key, e.target.value)
                    }
                  />
                </div>
              );
            })}
          </div>

          {/* Compact GTPAL display */}
          <h5>
            <strong>
              <div className="text-lg mt-2 center">
                G{gtpalData.gravida || 0} T{gtpalData.term || 0} P
                {gtpalData.preterm || 0} A{gtpalData.abortion || 0} L
                {gtpalData.living || 0}
              </div>
            </strong>
          </h5>
        </div>
      )}
    </div>
  );
}
