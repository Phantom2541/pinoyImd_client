import { MDBInput } from "mdbreact";

export default function Troupe({ task, handleSelectChange }) {
  const { purpose, company } = task;

  const purposeOptions = [
    "Pre-Employment",
    "Annual Medical Exam",
    "Random Testing",
    "Post-Incident / For Cause",
    "Return to Work",
    "LTO Requirement",
    "Court Order / Legal Requirement",
    "Walk-in / Personal",
    "Others",
  ];

  return (
    <>
      <div className="form-group">
        <label>Purpose</label>
        <select
          className="browser-default custom-select"
          value={purpose}
          onChange={(e) => handleSelectChange("purpose", e.target.value)}
          required
        >
          <option value="">-- Select Purpose --</option>
          {purposeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <MDBInput
        type="text"
        label="Requesting Parties"
        value={company}
        onChange={(e) => handleSelectChange("company", e.target.value)}
        required
      />
    </>
  );
}
