import React, { useState } from "react";

export default function MedicalExaminationClearance() {
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">
        MEDICAL EXAMINATION CLEARANCE
      </h1>

      {/* Requesting Company */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold">Requesting Company:</label>
          <input
            type="text"
            name="company"
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-semibold">Date:</label>
          <input
            type="date"
            name="date"
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      {/* Personal Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block font-semibold">Name:</label>
          <input
            type="text"
            name="name"
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block font-semibold">Age/Sex:</label>
            <input
              type="text"
              name="ageSex"
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
          <div className="col-span-2">
            <label className="block font-semibold">Civil Status:</label>
            <input
              type="text"
              name="civilStatus"
              onChange={handleChange}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Home Address:</label>
        <input
          type="text"
          name="address"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* PMHx */}
      <Section
        title="PMHx"
        options={[
          "Hypertension",
          "Diabetes Mellitus",
          "Pulmonary Tuberculosis",
          "Thyroid Disease",
          "Asthma",
        ]}
        handleChange={handleChange}
      />

      {/* FMHx */}
      <Section
        title="FMHx"
        options={[
          "Hypertension",
          "Asthma",
          "Heart Disease",
          "Cancer",
          "Diabetes Mellitus",
        ]}
        handleChange={handleChange}
      />

      {/* PSHx */}
      <Section
        title="PSHx"
        options={["Smoking Hx", "Alcohol Intake", "Illicit Drug Use"]}
        handleChange={handleChange}
      />

      {/* OB Gyne Hx */}
      <Section
        title="OB Gyne Hx"
        options={["Nulligravid"]}
        handleChange={handleChange}
      />
      <div className="mb-4">
        <label className="block font-semibold">G___P___(_____):</label>
        <input
          type="text"
          name="obgyne"
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Vital Signs */}
      <h2 className="font-bold mt-4 mb-2">VITAL SIGNS</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <InputField label="BP (mmHg)" name="bp" handleChange={handleChange} />
        <InputField label="PR/HR (bpm)" name="pr" handleChange={handleChange} />
        <InputField label="RR (cpm)" name="rr" handleChange={handleChange} />
        <InputField label="Temp (°C)" name="temp" handleChange={handleChange} />
        <InputField
          label="Height (cm)"
          name="height"
          handleChange={handleChange}
        />
        <InputField
          label="Weight (kg)"
          name="weight"
          handleChange={handleChange}
        />
      </div>
    </div>
  );
}

// Subcomponents
function Section({ title, options, handleChange }) {
  return (
    <div className="mb-4">
      <h2 className="font-bold mb-2">{title}</h2>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => (
          <label key={opt} className="flex items-center gap-2">
            <input type="checkbox" name={opt} onChange={handleChange} /> {opt}
          </label>
        ))}
      </div>
    </div>
  );
}

function InputField({ label, name, handleChange }) {
  return (
    <div>
      <label className="block font-semibold">{label}</label>
      <input
        type="text"
        name={name}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
    </div>
  );
}
