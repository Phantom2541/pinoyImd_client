import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Cloudinary } from "../../../services/utilities";

const MedicalClearanceFormPrint = () => {
  const { activePlatform = {} } = useSelector(({ auth }) => auth);

  const companyName = activePlatform?.company?.name;
  const branchName = activePlatform?.branch?.name;

  const BannerURL = `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
    companyName
  )}/${encodeURIComponent(branchName)}/banner`;

  const itemStyle = { marginBottom: "6px", fontSize: "0.9rem" };

  // 🔹 Auto open print dialog
  useEffect(() => {
    window.print();
  }, []);

  const renderTable = () => (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        border: "1px solid #000",
        marginBottom: "8px",
      }}
    >
      <thead>
        <tr>
          <th colSpan={4}>
            <img
              src={BannerURL}
              alt="Banner"
              style={{ maxHeight: "80px", margin: "auto", display: "block" }}
            />
          </th>
        </tr>
        <tr>
          <th
            colSpan={4}
            style={{
              fontSize: "1rem",
              textAlign: "center",
              padding: "6px",
            }}
          >
            MEDICAL EXAMINATION CLEARANCE
          </th>
        </tr>
      </thead>
      <tbody>
        {/* Patient Info */}
        <tr>
          <td colSpan={4} style={{ padding: "6px 10px", fontSize: "0.9rem" }}>
            Requesting Company: _____________________________ &nbsp;&nbsp;&nbsp;
            Date: _____________________________
          </td>
        </tr>

        <tr>
          <td colSpan={4} style={{ padding: "6px 10px", fontSize: "0.9rem" }}>
            Name: ____________________________________ &nbsp;&nbsp;&nbsp; Age/Sex:
            _______ &nbsp;&nbsp;&nbsp; Civil Status: _______
          </td>
        </tr>

        <tr>
          <td colSpan={4} style={{ padding: "6px 10px", fontSize: "0.9rem" }}>
            Home Address: _________________________________________________
          </td>
        </tr>

        {/* Histories */}
        <tr>
          <td colSpan={4} style={{ border: "1px solid #000", padding: "10px" }}>
            <div style={{ display: "flex", gap: "20px" }}>
              <div style={{ flex: 1 }}>
                <Section
                  title="PMHx"
                  items={[
                    "Hypertension",
                    "Diabetes Mellitus",
                    "Pulmonary Tuberculosis",
                    "Thyroid Disease",
                    "Asthma",
                  ]}
                  itemStyle={itemStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Section
                  title="FMHx"
                  items={[
                    "Hypertension",
                    "Asthma",
                    "Heart Disease",
                    "Cancer",
                    "Diabetes Mellitus",
                  ]}
                  itemStyle={itemStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Section
                  title="PSHx"
                  items={["Smoking Hx", "Alcohol Intake", "Illicit Drug Use"]}
                  itemStyle={itemStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Section
                  title="OB Gyne Hx"
                  items={["Nulligravid", "G___ P___ (____)"]}
                  itemStyle={itemStyle}
                />
              </div>
            </div>
          </td>
        </tr>

        {/* Vital Signs */}
        <tr>
          <td colSpan={4} style={{ padding: "10px", fontSize: "0.9rem" }}>
            <b>VITAL SIGNS</b>
            <div style={{ marginTop: "5px", lineHeight: "1.8" }}>
              BP: ______ mmHg &nbsp;&nbsp;&nbsp; PR/HR: ______ bpm
              &nbsp;&nbsp;&nbsp; RR: ______ cpm &nbsp;&nbsp;&nbsp; Temp: ______ °C
              &nbsp;&nbsp;&nbsp; Ht: ______ cm &nbsp;&nbsp;&nbsp; Wt: ______ kg
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="medicalClearanceForm-grid">
        {/* First copy */}
        {renderTable()}

        {/* Divider line */}
        <hr className="divider" />

        {/* Second copy */}
        {renderTable()}
      </div>

      {/* CSS */}
      <style>
        {`
          @media print {
            @page {
              size: A4;
              margin: 12mm;
            }
            .divider {
              border: none;
              border-top: 1px dashed #000;
              margin: 12px 0;
            }
            .medicalClearanceForm-grid {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 100vh; /* hatiin buong page */
            }
            .medicalClearanceForm-grid table {
              flex: 1;
              margin: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

const Section = ({ title, items, itemStyle }) => (
  <div style={{ marginBottom: "16px" }}>
    <div style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: "8px" }}>
      {title}
    </div>
    {items.map((item, idx) => (
      <div key={idx} style={itemStyle}>
        [ ] {item}
      </div>
    ))}
  </div>
);

export default MedicalClearanceFormPrint;
