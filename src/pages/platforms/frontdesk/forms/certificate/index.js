import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./reportCertificate.css";
import { Cloudinary } from "../../../../../services/utilities";

export default function MedicalExaminationClearance() {
  const { activePlatform = {} } = useSelector(({ auth }) => auth);

  const companyName = activePlatform?.branch?.companyId?.name;
  const branchName = activePlatform?.branch?.name;

  const BannerURL = `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
    companyName
  )}//${encodeURIComponent(branchName)}/banner`;
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="report-container">
      <th colSpan={6}>
        <img
          src={BannerURL}
          alt="Banner"
          className="laboratoryRequestForm-banner"
        />
      </th>
      <div className="report-title">PHYSICAL EXAMINATION CLEARANCE</div>
      {/* Row 1 */}
      <div className="form-row">
        <label>
          Name:
          <input type="text" name="name" onChange={handleChange} />
        </label>
        <label>
          Age:
          <input type="text" name="age" onChange={handleChange} />
        </label>
        <label className="gender-label">
          Gender:
          <span>
            <input
              type="radio"
              name="gender"
              value="Male"
              onChange={handleChange}
            />{" "}
            ( ) Male
          </span>
          <span>
            <input
              type="radio"
              name="gender"
              value="Female"
              onChange={handleChange}
            />{" "}
            ( ) Female
          </span>
        </label>
      </div>

      {/* Row 2 */}
      <div className="form-row">
        <label>
          Resident Address:
          <input type="text" name="address" onChange={handleChange} />
        </label>
        <label>
          Civil Status:
          <input type="text" name="civilStatus" onChange={handleChange} />
        </label>
      </div>

      {/* Row 3 */}
      <div className="form-row">
        <label className="full-width">
          Company Name:
          <input type="text" name="company" onChange={handleChange} />
        </label>
        <label>
          Date Examined:
          <input type="text" name="dateExamined" onChange={handleChange} />
        </label>
      </div>

      <div className="section exam-line">
        <span>Nature of Examination:</span>
        <label>
          <input type="checkbox" name="Annual PE" onChange={handleChange} />{" "}
          Annual PE
        </label>
        <label>
          <input
            type="checkbox"
            name="Pre-Employment"
            onChange={handleChange}
          />{" "}
          Pre-Employment
        </label>
        <label>
          <input
            type="checkbox"
            name="Medical Examination"
            onChange={handleChange}
          />{" "}
          Medical Examination
        </label>
      </div>

      {/* Row 3 */}
      <div className="form-1row">
        {/* <label className="full-width"> */}
        General Appearance:
        <input type="text" name="appearance" onChange={handleChange} />
        {/* </label> */}
      </div>

      {/* Vitals */}
      <div className="form-row">
        {[
          { label: "Height", name: "height" },
          { label: "Weight", name: "weight" },
          { label: "Temp", name: "temperature" },
          { label: "BP", name: "bp" },
          { label: "Pulse Rate", name: "pulseRate" },
          { label: "Resp. Rate", name: "respRate" },
        ].map(({ label, name }) => (
          <label key={name}>
            {label}:
            <input
              type="text"
              name={name}
              onChange={handleChange}
              className="short-line"
            />
          </label>
        ))}
      </div>

      {/* Vision */}
      <div className="form-row">
        {[
          { label: "OD:", name: "od" },
          { label: "OS:", name: "os" },
          { label: "Color Perception:", name: "colorPerception" },
        ].map(({ label, name }) => (
          <label key={name}>
            {label}:
            <input
              type="text"
              name={name}
              onChange={handleChange}
              className="short-line"
            />
          </label>
        ))}
      </div>

      {/* Past History */}
      <div className="form-1row">
        {[
          { label: "Past Medical History:", name: "pmhx" },
          { label: "Family History:", name: "fmhx" },
          { label: " Personal/Social History:", name: "pshx" },
          { label: "Review of System:", name: "ros" },
        ].map(({ label, name }) => (
          <label key={name}>
            {label}:
            <input
              type="text"
              name={name}
              onChange={handleChange}
              className="line"
            />
          </label>
        ))}
      </div>

      {/* Particulars + Ancillary */}
      <div className="split-section">
        <table className="report-table particulars">
          <thead>
            <tr>
              <th>Particular</th>
              <th>Normal</th>
              <th>Abnormal</th>
              <th>Findings</th>
            </tr>
          </thead>
          <tbody>
            {[
              "Head and Scalp",
              "Eyes and Ears",
              "Nose and Sinuses",
              "Mouth, Teeth & Tongue",
              "Throat, Pharynx",
              "Neck, Thyroid, Vessels",
              "Chest and Lungs",
              "Breast",
              "Heart",
              "Abdomen",
              "Anus/Rectum/Genitals",
              "Skin and Glands",
              "Extremities",
              "Reflexes",
            ].map((p) => (
              <tr key={p}>
                <td>{p}</td>
                <td className="center">
                  <input
                    type="checkbox"
                    name={`${p}-normal`}
                    onChange={handleChange}
                  />
                </td>
                <td className="center">
                  <input
                    type="checkbox"
                    name={`${p}-abnormal`}
                    onChange={handleChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name={`${p}-findings`}
                    onChange={handleChange}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="report-table ancillary">
          <thead>
            <tr>
              <th colSpan={2}>ANCILLARY PROCEDURES</th>
            </tr>
          </thead>
          <tbody>
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
            ].map((t) => (
              <tr key={t}>
                <td style={{ width: "50%" }}>{t}</td>
                <td style={{ width: "50%" }} className="center">
                  <input type="checkbox" name={t} onChange={handleChange} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Certification */}
      <div className="section certification">
        <h3 className="report-title">CERTIFICATION</h3>

        {[
          {
            label: "Class A",
            text: "Medically Fit for Employment",
          },
          {
            label: "Class B",
            text: "Medically Fit but with Minimal Findings",
            specify: true,
          },
          {
            label: "Class C",
            text: "With Obvious Defect but Maybe Employed at Management's Discretion",
          },
          {
            label: "Class D",
            text: "Medically Unfit for Employment",
            specify: true,
          },
        ].map(({ label, text, specify }) => (
          <div className="cert-row" key={label}>
            <label>
              <input
                type="radio"
                name="certification"
                value={`${label}: ${text}`}
                onChange={handleChange}
              />
              <span className="line"></span> {label}: {text}
            </label>
            {specify && (
              <div className="specify">Specify: ___________________</div>
            )}
          </div>
        ))}
      </div>

      {/* Recommendation & Remarks */}
      <div className="section">
        <p>
          Recommendation:
          <input type="text" name="recommendation" onChange={handleChange} />
        </p>
      </div>
      <div className="section">
        <p>
          Remarks: <input type="text" name="remarks" onChange={handleChange} />
        </p>
      </div>

      {/* Signature */}
      <div className="signature">
        <div className="sig-line"></div>
        <p>(Patient’s Name over Signature)</p>
        <div className="sig-line"></div>
        <p>Medical Examiner</p>
      </div>
    </div>
  );
}
