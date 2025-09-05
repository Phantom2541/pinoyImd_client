import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./reportCertificate.css";
import { Banner } from "../../../../../services/utilities";
import { MDBBtn } from "mdbreact";
import Header from "./header";

export default function MedicalExaminationClearance() {
  const { activePlatform = {} } = useSelector(({ auth }) => auth);
  const { branch = {} } = activePlatform;

  const [form, setForm] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handlePrintOut = () => {
    window.open(
      "/printout/certificate",
      "RequestForm",
      "top=100px,left=100px,width=1050px,height=750px"
    );
  };

  return (
    <div
      className="d-flex align-items-start justify-content-center"
      style={{ gap: "20px" }}
    >
      <div className="report-container">
        <th>
          <Banner company={branch?.companyId.name} branch={branch?.name} />
        </th>
        <div className="report-title">PHYSICAL EXAMINATION REPORT</div>
        <Header handleChange={handleChange} />

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
                  <td style={{ width: "50%" }} className="pb-1">
                    {t}
                  </td>
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
      <MDBBtn
        size="md"
        color="primary"
        onClick={handlePrintOut}
        className="mt-5"
      >
        Print
      </MDBBtn>
    </div>
  );
}
