// Sections.jsx
import { MDBDatePicker } from "mdbreact";
import React, { useState, useEffect, useRef } from "react";

/** ---------- Shared Components ---------- */
const CheckboxRow = ({ label, checked, onClick, style }) => (
  <div
    className="flex items-center gap-2 cursor-pointer text-sm mb-2"
    onClick={onClick}
  >
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 16,
        height: 16,
        border: "1.5px solid #000",
        fontSize: 12,
        fontWeight: "bold",
        ...style,
      }}
    >
      {checked ? "✓" : ""}
    </div>
    <span style={{ marginLeft: 8, fontSize: 20 }}>{label}</span>
  </div>
);

const TextInput = ({ value, onChange, width = "8rem", placeholder }) => (
  <input
    type="text"
    className="border ml-2 text-center"
    style={{ width }}
    value={value}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
  />
);

const NumberInput = ({ value, onChange, width = "5rem" }) => (
  <input
    type="number"
    min="0"
    className="border ml-2 text-center"
    style={{ width }}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

const DateInput = ({ value, onChange, width = "10rem" }) => (
  <MDBDatePicker
    valueDefault={value || new Date()}
    getValue={onChange}
    className="mt-1 mb-1"
    style={{ width }}
  />
);

/** ---------- FamilyRootSystem ---------- */
export function FamilyRootSystem({ step, form, handleCheck }) {
  const [items, setItems] = useState({ Mother: [], Father: [] });
  const [newDisease, setNewDisease] = useState("");

  // Merge parent and form diseases
  useEffect(() => {
    const allDiseases = new Set([
      ...(step.items.Mother || []),
      ...(step.items.Father || []),
      ...(form?.familyHistory?.Mother || []),
      ...(form?.familyHistory?.Father || []),
    ]);
    const mergedList = Array.from(allDiseases);
    setItems({ Mother: mergedList, Father: mergedList });
  }, [step.items, form?.familyHistory]);

  const sides = [
    { label: "Mother", align: "end", dx: -20, dir: -1 },
    { label: "Father", align: "start", dx: 20, dir: 1 },
  ];

  const itemHeight = 40;
  const startY = 80;
  const rootX = 250;
  const height = items.Mother.length * itemHeight + 180;

  const handleAddDisease = () => {
    if (!newDisease.trim()) return;
    const merged = Array.from(
      new Set([...items.Mother, ...items.Father, newDisease.trim()])
    );
    setItems({ Mother: merged, Father: merged });
    setNewDisease("");
  };

  return (
    <>
      <svg width="600" height={height}>
        {sides.map(({ label, align, dx, dir }) =>
          items[label].map((item, i) => {
            const y = startY + i * itemHeight;
            const checked = form?.familyHistory?.[label]?.includes(item);
            const labelWidth = item.length * 8.5;

            return (
              <g
                key={`${label}-${item}`}
                style={{ cursor: "pointer" }}
                onClick={() => handleCheck(label, item, !checked)}
              >
                <text x={rootX + dx} y={y} textAnchor={align} fontSize={17}>
                  {item}
                </text>
                {checked && (
                  <>
                    <line
                      x1={rootX}
                      y1={20}
                      x2={rootX}
                      y2={y - 2}
                      stroke="red"
                      strokeWidth={2}
                    />
                    <line
                      x1={rootX}
                      y1={y}
                      x2={rootX + dir * (labelWidth + 20)}
                      y2={y}
                      stroke="red"
                      strokeWidth={2}
                    />
                  </>
                )}
              </g>
            );
          })
        )}
      </svg>

      <div className="mt-3 d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Add other disease"
          value={newDisease}
          onChange={(e) => setNewDisease(e.target.value)}
        />
        <button className="btn btn-sm btn-info" onClick={handleAddDisease}>
          Add
        </button>
      </div>
    </>
  );
}

/** ---------- ChecklistSection ---------- */
export function ChecklistSection({
  step,
  form,
  handleCheck,
  handleTextChange,
  handleFrequency,
  handleRemove,
}) {
  const baseKeyMap = {
    PSHx: "surgeries",
    PMHx: "conditions",
    socialHistory: "habits",
  };
  const baseKey = baseKeyMap[step.code];
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const lastItemRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const initialItems =
      step.code === "socialHistory"
        ? (form.habits || []).map((h) => ({ label: h.name }))
        : (form[baseKey] || []).map((c) => ({ label: c.name }));

    const stepItems = (step.items || []).map((i) =>
      typeof i === "string" ? { label: i } : i
    );

    const merged = [
      ...new Set([...stepItems, ...initialItems].map((i) => i.label)),
    ].map((label) => ({ label }));

    setItems(merged);
    setNewItem("");
  }, [step.code, step.items, form[baseKey], form.habits]);

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    const label = newItem.trim();
    if (items.some((i) => i.label === label)) return;
    setItems([...items, { label }]);
    handleCheck(baseKey, label, false);
    setNewItem("");
    inputRef.current?.focus();
  };

  const handleRemoveItem = (label) => {
    setItems(items.filter((i) => i.label !== label));
    handleRemove?.(baseKey, label);
  };

  useEffect(() => {
    lastItemRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [items]);

  return (
    <div>
      {items.map((item, idx) => {
        const entry =
          step.code === "socialHistory"
            ? form.habits?.find((h) => h.name === item.label)
            : form[baseKey]?.find(
                (c) =>
                  c.name?.toLowerCase().trim() ===
                  item.label.toLowerCase().trim()
              );

        const checked = !!entry;
        const details = entry?.details || "";
        const date = entry?.date || "";
        const freq = entry?.freq || "";

        return (
          <div
            key={item.label}
            className="mb-3"
            ref={idx === items.length - 1 ? lastItemRef : null}
          >
            <div className="d-flex align-items-center">
              <CheckboxRow
                label={item.label}
                checked={checked}
                onClick={() => handleCheck(baseKey, item.label, !checked)}
              />
              <button
                type="button"
                onClick={() => handleRemoveItem(item.label)}
                style={{
                  marginLeft: 8,
                  background: "transparent",
                  border: "none",
                  color: "red",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                title="Remove"
              >
                ×
              </button>
            </div>

            {checked && ["PSHx", "PMHx"].includes(step.code) && (
              <div className="mt-1 d-flex flex-column ml-6">
                <TextInput
                  value={details}
                  onChange={(val) =>
                    handleTextChange(baseKey, item.label, "details", val)
                  }
                  placeholder="Details"
                />
                <DateInput
                  value={date}
                  onChange={(val) =>
                    handleTextChange(baseKey, item.label, "date", val)
                  }
                />
              </div>
            )}

            {checked && step.code === "socialHistory" && (
              <div className="mt-1 d-flex flex-column ml-6">
                {["Daily", "Once a week", "Twice a week", "Occasional"].map(
                  (f) => (
                    <CheckboxRow
                      key={f}
                      label={f}
                      checked={freq === f}
                      onClick={() => handleFrequency(item.label, f)}
                    />
                  )
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-3 d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder={`Add other ${baseKey}`}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          ref={inputRef}
        />
        <button className="btn btn-sm btn-info" onClick={handleAddItem}>
          Add
        </button>
      </div>
    </div>
  );
}

/** ---------- ObGyneSection ---------- */
export function ObGyneSection({ step, form, handleNumber, handleTextChange }) {
  const sectionData = form[step.code] || {};
  const gtpalData = sectionData.gtpal || {};

  const obGyneKeyMap = {
    "At what age did you have your first menstruation": "menarche",
    "When was your last menstrual period?": "lmp",
    "Are you currently using any method of contraception?": "contraception",
  };

  const gtpalFieldMap = {
    "How many times have you been pregnant?": "gravida",
    "How many reached 9 months or full term?": "term",
    "Any preterm deliveries?": "preterm",
    "Any miscarriages or abortions?": "abortion",
    "How many living children?": "living",
  };

  const gtpalItem = step.items?.find(
    (item) => item.label.toLowerCase() === "gtpal"
  );

  return (
    <div className="space-y-4">
      {step.items
        ?.filter((item) => item.label.toLowerCase() !== "gtpal")
        .map((item) => {
          const key = obGyneKeyMap[item.label] || item.label;
          const value = sectionData[key] || "";

          if (key === "lmp") {
            return (
              <div key={key} className="flex items-center mb-1">
                <label className="w-80 text-sm mb-1 mt-1">{item.label}</label>
                <DateInput
                  value={value}
                  onChange={(val) =>
                    handleTextChange(step.code, "lmp", "date", val)
                  }
                />
              </div>
            );
          }

          const InputComp = key === "menarche" ? NumberInput : TextInput;
          const width = key === "menarche" ? "5rem" : "8rem";

          return (
            <div key={key} className="flex items-center mb-1">
              <label className="w-80 text-sm mb-1 mt-1">{item.label}</label>
              <InputComp
                width={width}
                value={value}
                onChange={(val) =>
                  key === "menarche"
                    ? handleNumber(step.code, key, val)
                    : handleTextChange(step.code, key, "text", val)
                }
              />
            </div>
          );
        })}

      {gtpalItem && (
        <div className="mt-1">
          <div className="flex flex-col gap-3">
            {gtpalItem.children.map((child) => {
              const key = gtpalFieldMap[child.label];
              return (
                <div key={key} className="flex items-center gap-2">
                  <label className="w-64">{child.label}</label>
                  <NumberInput
                    value={gtpalData[key] || ""}
                    onChange={(val) => handleNumber(step.code, key, val)}
                  />
                </div>
              );
            })}
          </div>
          <h5>
            <strong>
              <div className="text-lg mt-2 center font-bold">
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
