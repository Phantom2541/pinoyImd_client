import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Cloudinary } from "../../../services/utilities";

const MedicalClearanceFormPrint = () => {
  const { activePlatform = {} } = useSelector(({ auth }) => auth);

  const companyName = activePlatform?.company?.name || "default-company";
  const branchName = activePlatform?.branch?.name || "default-branch";

  const BannerURL =
    companyName && branchName
      ? `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
          companyName
        )}/${encodeURIComponent(branchName)}/banner`
      : null;

  const itemStyle = { marginBottom: "6px", fontSize: "0.9rem" };

  // 🔹 Preload banner before print
  useEffect(() => {
    if (BannerURL) {
      const img = new Image();
      img.src = BannerURL;
      img.onload = () => window.print();
      img.onerror = () => window.print();
    } else {
      window.print();
    }
  }, [BannerURL]);

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
          <th colSpan={4} style={{ padding: "0" }}>
            {BannerURL ? (
              <img
                src={BannerURL}
                alt="Banner"
                style={{
                  maxHeight: "100px",
                  width: "100%",
                  display: "block",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  fontStyle: "italic",
                }}
              >
                [No Banner Available]
              </div>
            )}
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
        <tr>
          <td colSpan={4} style={{ padding: "6px 10px", fontSize: "0.9rem" }}>
            Requesting Company: _________________________________________ &nbsp;&nbsp;&nbsp;
            Date: _______________________________
          </td>
        </tr>

        <tr>
          <td colSpan={4} style={{ padding: "6px 10px", fontSize: "0.9rem" }}>
            Name: ____________________________________ &nbsp;&nbsp;&nbsp; Age/Sex:
            _______ &nbsp;&nbsp;&nbsp; Civil Status: __________________________
          </td>
        </tr>

        <tr>
          <td colSpan={4} style={{ padding: "6px 10px", fontSize: "0.9rem" }}>
            Home Address: ____________________________________________________________________________________
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
                  items={["Hypertension", "Asthma", "Heart Disease", "Cancer", "Diabetes Mellitus"]}
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
                <Section title="OB Gyne Hx" items={["Nulligravid", "G___ P___ (____)"]} itemStyle={itemStyle} />
              </div>
            </div>
          </td>
        </tr>

        {/* Vital Signs */}
        <tr>
          <td
            colSpan={4}
            style={{
              padding: "10px",
              fontSize: "0.9rem",
              border: "1px solid #000",
            }}
          >
            <div style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: "8px" }}>
              VITAL SIGNS
            </div>
            <div style={{ marginTop: "5px", lineHeight: "1.8" }}>
              <span style={{ fontWeight: "bold" }}>BP:</span> ______ mmHg &nbsp;&nbsp;&nbsp; 
              <span style={{ fontWeight: "bold" }}>PR/HR:</span> ______ bpm &nbsp;&nbsp;&nbsp; 
              <span style={{ fontWeight: "bold" }}>RR:</span> ______ cpm &nbsp;&nbsp;&nbsp; 
              <span style={{ fontWeight: "bold" }}>Temp:</span> ______ °C &nbsp;&nbsp;&nbsp; 
              <span style={{ fontWeight: "bold" }}>Ht:</span> ______ cm &nbsp;&nbsp;&nbsp; 
              <span style={{ fontWeight: "bold" }}>Wt:</span> ______ kg
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
              size: A4 portrait;
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
              justify-content: flex-start;
            }
            .medicalClearanceForm-grid table {
              margin: 0;
              page-break-inside: avoid;
            }
            img {
              max-width: 100%;
              height: auto;
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
