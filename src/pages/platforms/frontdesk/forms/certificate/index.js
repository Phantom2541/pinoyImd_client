import React, { useState } from "react";

export default function PhysicalExaminationReport() {
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">
        PHYSICAL EXAMINATION REPORT
      </h1>

      {/* Personal Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <InputField label="Name" name="name" handleChange={handleChange} />
        <div className="grid grid-cols-3 gap-2">
          <InputField label="Age" name="age" handleChange={handleChange} />
          <div>
            <label className="block font-semibold">Gender:</label>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  onChange={handleChange}
                />{" "}
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  onChange={handleChange}
                />{" "}
                Female
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <InputField
          label="Resident Address"
          name="address"
          handleChange={handleChange}
        />
        <InputField
          label="Civil Status"
          name="civilStatus"
          handleChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <InputField
          label="Company Name"
          name="company"
          handleChange={handleChange}
        />
        <InputField
          label="Date Examined"
          name="dateExamined"
          type="date"
          handleChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Nature of Examination:</label>
        <div className="flex gap-6">
          {["Annual PE", "Pre-Employment", "Medical Examination"].map((opt) => (
            <label key={opt}>
              <input type="checkbox" name={opt} onChange={handleChange} /> {opt}
            </label>
          ))}
        </div>
      </div>

      {/* General Appearance + Vitals */}
      <InputField
        label="General Appearance"
        name="generalAppearance"
        handleChange={handleChange}
      />

      <div className="grid grid-cols-3 gap-4 mb-4 mt-2">
        <InputField label="Height" name="height" handleChange={handleChange} />
        <InputField label="Weight" name="weight" handleChange={handleChange} />
        <InputField
          label="Temperature"
          name="temperature"
          handleChange={handleChange}
        />
        <InputField label="BP" name="bp" handleChange={handleChange} />
        <InputField
          label="Pulse Rate"
          name="pulseRate"
          handleChange={handleChange}
        />
        <InputField
          label="Resp. Rate"
          name="respRate"
          handleChange={handleChange}
        />
      </div>

      {/* Vision */}
      <h2 className="font-bold mt-4 mb-2">Vision</h2>
      <div className="grid grid-cols-3 gap-4 mb-4">
        <InputField label="OD" name="od" handleChange={handleChange} />
        <InputField label="OS" name="os" handleChange={handleChange} />
        <InputField
          label="Color Perception"
          name="colorPerception"
          handleChange={handleChange}
        />
      </div>

      {/* Histories */}
      <InputField
        label="Past Medical History"
        name="pmhx"
        handleChange={handleChange}
      />
      <InputField
        label="Family History"
        name="fmhx"
        handleChange={handleChange}
      />
      <InputField
        label="Personal/Social History"
        name="pshx"
        handleChange={handleChange}
      />
      <InputField
        label="Review of System"
        name="ros"
        handleChange={handleChange}
      />

      {/* Review of System Table */}
      <h2 className="font-bold mt-6 mb-2">Particulars</h2>
      <table className="w-full border mb-4 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Particular</th>
            <th className="border p-2">Normal</th>
            <th className="border p-2">Abnormal</th>
            <th className="border p-2">Findings</th>
          </tr>
        </thead>
        <tbody>
          {[
            "Head and Scalp",
            "Eyes and Ears",
            "Nose and Sinuses",
            "Mouth,Teeth,& Tongue",
            "Throat, Pharynx",
            "Neck nodes, Thyroid & Vess",
            "Chest and Lungs",
            "Breast",
            "Heart",
            "Abdomen",
            "Anus, Rectum, and Genitals",
            "Skin and Glands",
            "Extremities",
            "Reflexes",
          ].map((part) => (
            <tr key={part}>
              <td className="border p-2 font-medium">{part}</td>
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  name={`${part}-normal`}
                  onChange={handleChange}
                />
              </td>
              <td className="border p-2 text-center">
                <input
                  type="checkbox"
                  name={`${part}-abnormal`}
                  onChange={handleChange}
                />
              </td>
              <td className="border p-2">
                <input
                  type="text"
                  name={`${part}-findings`}
                  onChange={handleChange}
                  className="w-full border p-1 rounded"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Ancillary Procedures */}
      <h2 className="font-bold mt-6 mb-2">ANCILLARY PROCEDURES</h2>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          "Chest X-ray",
          "Urinalysis",
          "Stool Examination",
          "CBC",
          "FBS",
          "ECG",
          "HbsAg",
          "Pregnancy Test",
          "Drug Test",
          "Special Procedures",
        ].map((test) => (
          <label key={test} className="flex items-center gap-2">
            <input type="checkbox" name={test} onChange={handleChange} /> {test}
          </label>
        ))}
      </div>

      {/* Certification */}
      <h2 className="font-bold mt-6 mb-2">CERTIFICATION</h2>
      <div className="mb-4">
        {[
          "CLASS - A: Medically Fit for Employment",
          "CLASS - B: Medically Fit but with Minimal Findings.",
          "CLASS - C: With Obvious Defect but Maybe Employed at Management's Discretion",
          "CLASS - D: Medically Unfit for Employment.",
        ].map((c) => (
          <label key={c} className="block mb-2">
            <input
              type="radio"
              name="certification"
              value={c}
              onChange={handleChange}
            />{" "}
            {c}
          </label>
        ))}
      </div>
      <InputField label="Specify" name="specify" handleChange={handleChange} />

      {/* Recommendation & Remarks */}
      <InputField
        label="Recommendation"
        name="recommendation"
        handleChange={handleChange}
      />
      <InputField label="Remarks" name="remarks" handleChange={handleChange} />

      {/* Signature */}
      <div className="mt-6 text-center">
        <p className="mb-2">~~ CERTIFICATION ~~</p>
        <p className="italic">(Patient’s Name over Signature)</p>
        <p className="font-semibold">Medical Examiner</p>
        <InputField
          label="Contact Number"
          name="contactNumber"
          handleChange={handleChange}
        />
      </div>
    </div>
  );
}

function InputField({ label, name, handleChange, type = "text" }) {
  return (
    <div className="mb-4">
      <label className="block font-semibold">{label}</label>
      <input
        type={type}
        name={name}
        onChange={handleChange}
        className="border p-2 w-full rounded"
      />
    </div>
  );
}
