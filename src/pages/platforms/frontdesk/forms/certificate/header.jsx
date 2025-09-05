import React from "react";

export default function Header({ handleChange }) {
  return (
    <div className="top-physical-container">
      {/* Row 1 */}
      <div className="pe-row">
        <label className="name">
          Name:
          <input type="text4" name="name" onChange={handleChange} />
        </label>
        <label className="age">
          Age:
          <input type="text" name="age" onChange={handleChange} />
        </label>
        <label className="gender">
          Gender:
          <span>( ) Male</span>
          <span>( ) Female</span>
        </label>
      </div>

      {/* Row 2 */}
      <div className="pe-row">
        <label>
          Resident Address:
          <input type="text5" name="address" onChange={handleChange} />
        </label>
        <label>
          Civil Status:
          <input type="text" name="civilStatus" onChange={handleChange} />
        </label>
      </div>

      {/* Row 3 */}
      <div className="pe-row">
        <label>
          Company Name:
          <input type="text6" name="company" onChange={handleChange} />
        </label>
        <label>
          Date Examined:
          <input type="text" name="dateExamined" onChange={handleChange} />
        </label>
      </div>
      <div className="pe-row label">
        <label className="mr-2">Nature of Examination:</label>
        <label className="mr-1">[&nbsp;&nbsp;]&nbsp;&nbsp;Annual PE</label>
        <label className="mr-1">[&nbsp;&nbsp;]&nbsp;&nbsp;Pre-Employment</label>
        <label>[&nbsp;&nbsp;]&nbsp;&nbsp;Medical Examination</label>
      </div>
      {/* Row 3 */}
      <div className="pe-row">
        General Appearance:
        <input type="text7" name="appearance" onChange={handleChange} />
      </div>

      {/* Vitals */}
      <div className="pe-row mt-2">
        {[
          { label: "Height", name: "height" },
          { label: "Weight", name: "weight" },
          { label: "Temp", name: "temperature" },
          { label: "BP", name: "bp" },
          { label: "Pulse Rate", name: "pulseRate" },
          { label: "Resp. Rate", name: "respRate" },
        ].map(({ label, name }) => (
          <small
            key={name}
            className="ml-1 d-flex"
            style={{ whiteSpace: "nowrap" }}
          >
            {label}:
            <input type="text2" name={name} onChange={handleChange} />
          </small>
        ))}
      </div>

      {/* Vision */}
      <div className="pe-row d-flex justify-content-between mt-2">
        <label>Vision</label>
        {[
          { label: "OD", name: "od" },
          { label: "OS", name: "os" },
          { label: "Color Perception", name: "colorPerception" },
        ].map(({ label, name }) => (
          <label key={name}>
            {label}:
            <input type="text8" name={name} onChange={handleChange} />
          </label>
        ))}
      </div>

      {/* Past History */}
      <div className="pe-column">
        {[
          { label: "Past Medical History", name: "pmhx" },
          { label: "Family History", name: "fmhx" },
          { label: " Personal/Social History", name: "pshx" },
          { label: "Review of System", name: "ros" },
        ].map(({ label, name }) => (
          <label key={name}>
            <span>{label}:</span>
            <input type="text1" name={name} onChange={handleChange} />
          </label>
        ))}
      </div>
    </div>
  );
}
