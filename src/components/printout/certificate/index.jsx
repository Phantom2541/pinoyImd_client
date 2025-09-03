import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import "./reportCertificate.css";
import { Cloudinary } from "../../../services/utilities";
import { MDBBtn } from "mdbreact";

export default function MedicalExaminationClearance() {
  const { activePlatform = {} } = useSelector(({ auth }) => auth);

  const companyName = activePlatform?.branch?.companyId?.name;
  const branchName = activePlatform?.branch?.name;

  const BannerURL = `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
    companyName
  )}/${encodeURIComponent(branchName)}/banner`;
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    window.print();
  }, []);

  return (
    <div className="report-container">
      <th>
        <img
          src={BannerURL}
          alt="Banner"
          className="laboratoryRequestForm-banner"
        />
      </th>
      <div className="report-title">PHYSICAL EXAMINATION REPORT</div>
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
          <label className="mr-1">
            [&nbsp;&nbsp;]&nbsp;&nbsp;Pre-Employment
          </label>
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

      {/* Particulars + Ancillary */}
      <div className="split-section">
        <table className="report-table particulars">
          <thead>
            <tr>
              <th className="pb-1">Particular</th>
              <th className="text-center pb-1">Normal</th>
              <th className="text-center pb-1">Abnormal</th>
              <th className="text-center pb-1">Findings</th>
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
                <td style={{ width: "35%" }}>
                  {/* <input
                    type="text"
                    name={`${p}-findings`}
                    onChange={handleChange}
                  /> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="report-table ancillary">
          <thead>
            <tr>
              <th colSpan={2} className="text-center pb-2 font-weight-bold">
                ANCILLARY PROCEDURES
              </th>
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
                <td style={{ width: "60%" }} className="pb-1">
                  {t}
                </td>
                <td style={{ width: "40%" }} className="center">
                  <input type="checkbox" name={t} onChange={handleChange} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Certification */}
      <div className="section certification">
        <h2 className="report-title-certification">~ ~ CERTIFICATION ~ ~</h2>

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

        {/* Recommendation & Remarks */}
        <div className="recommendationRemarks">
          <div className="d-flex align-items-flex-end">
            <span>RECOMMENDATION:</span>
            <div
              className="w-100"
              style={{ borderBottom: "1px solid black" }}
            />
          </div>
          <div
            className="w-100"
            style={{ borderBottom: "1px solid black", height: "25px" }}
          />
        </div>
        <div className="recommendationRemarks">
          <div className="d-flex align-items-flex-end">
            <span>REMARKS:</span>
            <div
              className="w-100"
              style={{ borderBottom: "1px solid black" }}
            />
          </div>
          <div
            className="w-100"
            style={{ borderBottom: "1px solid black", height: "25px" }}
          />
        </div>

        {/* Signature */}
        <div className="d-flex justify-content-between mt-4">
          <div className="d-flex flex-column">
            <div className="sig-line"></div>
            <small>(Patient’s Name over Signature)</small>
          </div>
          <div className="d-flex flex-column align-items-center w-25">
            <div className="d-flex w-100">
              <div className="sig-line" />,<span>MD</span>
            </div>
            <small>Medical Examiner</small>
          </div>
        </div>
        <div className="d-flex">
          <small>Couriers Number:</small>
          <div className="w-25" style={{ borderBottom: "1px solid black" }} />
        </div>
      </div>
    </div>
  );
}
