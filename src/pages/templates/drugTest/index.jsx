import React from "react";
import "./style.css";
import { drugTestData } from "./collections";

export default function DrugTest() {
  const {
    reportId,
    profile,
    departmentInfo,
    personalInfo,
    timestamps,
    results,
    conductedBy,
    approvedBy,
    validityNote,
    notice,
  } = drugTestData;

  return (
    <div className="drugTest-section">
      <div className="drugTest-container">
        <div className="drugTest-reportId">
          <span>Report ID: {reportId}</span>
        </div>

        <div className="drugTest-header">
          <div className="drugTest-profile">
            <span>EL</span>
            <div>
              <img src={profile.image} alt="Profile" />
              <span>{profile.code}</span>
            </div>
          </div>
          <div className="drugTest-department">
            <span>{departmentInfo.agency}</span>
            <span>{departmentInfo.institution}</span>
            <span>{departmentInfo.address}</span>
            <span>{departmentInfo.phone}</span>
            <span>{departmentInfo.reportTitle}</span>
          </div>
          <div className="drugTest-logo">
            <img src={departmentInfo.logo} alt="LOGO" />
          </div>
        </div>

        <div className="drugTest-body">
          <div className="drugTest-info">
            <div className="drugTest-info-labels">
              <span>CCF No:</span>
              <span>Name:</span>
              <span>BirthDate:</span>
              <span className="mt-2">Test Method:</span>
              <span className="mt-2">Purpose:</span>
              <span>Others:</span>
            </div>
            <div className="drugTest-info-values">
              <span>{personalInfo.ccfNo}</span>
              <span>{personalInfo.name.toUpperCase()}</span>
              <div className="drugTest-info-values-date">
                <span>{personalInfo.birthDate}</span>
                <span>Age: {personalInfo.age}</span>
                <span>Gender: {personalInfo.isMale ? "M" : "F"}</span>
              </div>
              <span className="mt-2">{personalInfo.testMethod}</span>
              <span className="mt-2">{personalInfo.purpose}</span>
              <span>{personalInfo.others}</span>
            </div>
          </div>

          <div className="drugTest-infoTime">
            <div className="drugTest-infoTime-labels">
              <span>Transuction Date Time:</span>
              <span>Report Date Time:</span>
            </div>
            <div className="drugTest-infoTime-values">
              <span>{timestamps.transaction}</span>
              <span>{timestamps.report}</span>
            </div>
          </div>
        </div>

        <div className="drugTest-result">
          <span>Result</span>
          <table className="drugTest-result-table">
            <thead>
              <tr>
                <th>Drug/Metabolite</th>
                <th>Result</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {results.map(({ drug, result, remarks }, idx) => (
                <tr key={idx}>
                  <td>{drug}</td>
                  <td>{result}</td>
                  <td>{remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="drugTest-footer">
          <div className="drugTest-footer-info">
            <div>
              <span>Test Conducted By</span>
              <div className="drugTest-footer-signature">
                <img src={conductedBy.signature} alt="signature" />
                <span>{conductedBy.name.toLowerCase()}</span>
              </div>
              <span>{conductedBy.role}</span>
            </div>
            <div>
              <span>Approved By</span>
              <div className="drugTest-footer-signature">
                <img src={approvedBy.signature} alt="signature" />
                <span>{approvedBy.name.toLowerCase()}</span>
              </div>
              <span>{approvedBy.role}</span>
            </div>
          </div>
          <div className="drugTest-footer-valid">
            <span>{validityNote}</span>
          </div>
          <div className="drugTest-footer-notice">
            <span>{notice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
