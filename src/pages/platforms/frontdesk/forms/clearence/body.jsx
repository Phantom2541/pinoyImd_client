import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Cloudinary } from "../../../../../services/utilities";
import { MDBBtn } from "mdbreact";

const MedicalClearanceForm = () => {
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
  const [bannerLoaded, setBannerLoaded] = useState(false);

  // Preload banner before printing
  const handlePrint = () => {
    if (BannerURL) {
      const img = new Image();
      img.src = BannerURL;
      img.onload = () => {
        setBannerLoaded(true);
        window.open(
          "/printout/laboratoryClearanceRequestForm",
          "RequestForm",
          "top=100px,left=100px,width=1050px,height=750px"
        );
      };
      img.onerror = () => {
        setBannerLoaded(false);
        window.open(
          "/printout/laboratoryClearanceRequestForm",
          "RequestForm",
          "top=100px,left=100px,width=1050px,height=750px"
        );
      };
    } else {
      window.open(
        "/printout/laboratoryClearanceRequestForm",
        "RequestForm",
        "top=100px,left=100px,width=1050px,height=750px"
      );
    }
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header with Print Button (hidden on print) */}
      <div className="no-print" style={{ marginBottom: "12px" }}>
        <MDBBtn size="md" color="primary" onClick={handlePrint}>
          Print
        </MDBBtn>
      </div>

      {/* Clearance Form */}
      <table
        style={{
          width: "100%",
          maxWidth: "800px",
          background: "#fff",
          borderCollapse: "collapse",
          border: "1px solid #000",
        }}
      >
        <thead>
          <tr>
            <th colSpan={4} style={{ border: "1px solid #000", padding: 0 }}>
              {BannerURL ? (
                <img
                  src={BannerURL}
                  alt="Banner"
                  style={{
                    maxHeight: "80px",
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
                border: "1px solid #000",
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
            Requesting Company: _____________________________________________ &nbsp;&nbsp;&nbsp;
            Date: __________________________
          </td>
        </tr>

        <tr>
          <td colSpan={4} style={{ padding: "6px 10px", fontSize: "0.9rem" }}>
            Name: _______________________________________________ &nbsp;&nbsp;&nbsp; Age/Sex:
            _______ &nbsp;&nbsp;&nbsp; Civil Status: ______________
          </td>
        </tr>

        <tr>
          <td colSpan={4} style={{ padding: "6px 10px", fontSize: "0.9rem" }}>
            Home Address: ____________________________________________________________________________________
          </td>
        </tr>

          {/* Histories */}
          <tr>
            <td
              style={{
                border: "1px solid #000",
                verticalAlign: "top",
                width: "25%",
                padding: "8px",
              }}
            >
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
            </td>
            <td
              style={{
                border: "1px solid #000",
                verticalAlign: "top",
                width: "25%",
                padding: "8px",
              }}
            >
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
            </td>
            <td
              style={{
                border: "1px solid #000",
                verticalAlign: "top",
                width: "25%",
                padding: "8px",
              }}
            >
              <Section
                title="PSHx"
                items={["Smoking Hx", "Alcohol Intake", "Illicit Drug Use"]}
                itemStyle={itemStyle}
              />
            </td>
            <td
              style={{
                border: "1px solid #000",
                verticalAlign: "top",
                width: "25%",
                padding: "8px",
              }}
            >
              <Section
                title="OB Gyne Hx"
                items={["Nulligravid", "G___ P___ (____)"]}
                itemStyle={itemStyle}
              />
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
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  marginBottom: "8px",
                }}
              >
                VITAL SIGNS
              </div>
              <div style={{ marginTop: "5px", lineHeight: "1.8" }}>
                <span style={{ fontWeight: "bold" }}>BP:</span> ______ mmHg
                &nbsp;&nbsp;&nbsp;
                <span style={{ fontWeight: "bold" }}>PR/HR:</span> ______ bpm
                &nbsp;&nbsp;&nbsp;
                <span style={{ fontWeight: "bold" }}>RR:</span> ______ cpm
                &nbsp;&nbsp;&nbsp;
                <span style={{ fontWeight: "bold" }}>Temp:</span> ______ °C
                &nbsp;&nbsp;&nbsp;
                <span style={{ fontWeight: "bold" }}>Ht:</span> ______ cm
                &nbsp;&nbsp;&nbsp;
                <span style={{ fontWeight: "bold" }}>Wt:</span> ______ kg
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Print styles */}
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
            body {
              background: #fff !important;
            }
            @page {
              size: A4 portrait;
              margin: 12mm;
            }
            img {
              max-width: 100%;
              height: auto;
              display: block;
            }
          }
        `}
      </style>
    </div>
  );
};

const Section = ({ title, items, itemStyle }) => (
  <div>
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

export default MedicalClearanceForm;
