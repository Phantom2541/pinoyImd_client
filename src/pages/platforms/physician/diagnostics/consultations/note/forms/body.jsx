import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Cloudinary,
  fullAddress,
  fullName,
} from "../../../../../../../services/utilities";

const RequestForm = () => {
  const { activePlatform = {} } = useSelector(({ auth }) => auth);
  const { patient } = useSelector(({ consultations }) => consultations);
  const { user, dob, isMale, mobile, address, physician } = patient || {};

  const companyName = activePlatform?.branch?.companyId?.name || "";
  const branchName = activePlatform?.branch?.name || "";
  const BannerURL = `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
    companyName
  )}//${encodeURIComponent(branchName)}/banner`;

  // Centralized state for all sections
  const [selections, setSelections] = useState({
    Hematology: [],
    "Clinical Microscopy": [],
    Serology: [],
    "Clinical Chemistry": [],
    Other: [],
  });

  const toggleItem = (section, item) => {
    setSelections((prev) => {
      const current = prev[section] || [];
      return {
        ...prev,
        [section]: current.includes(item)
          ? current.filter((x) => x !== item)
          : [...current, item],
      };
    });
  };

  const handleSave = () => {
    console.log("Saving payload:", selections);
    // axios.post("/api/requests", selections)
  };

  const sectionsConfig = [
    {
      title: "Hematology",
      items: ["CBC", "CBC w/ APC", "Platelet Count", "Blood Typing", "ESR"],
    },
    {
      title: "Clinical Microscopy",
      items: ["Urinalysis", "Pregnancy Test", "Fecalysis", "Occult Blood"],
    },
    {
      title: "Serology",
      items: ["Dengue Duo", "HBsAG Screening", "VDAL / RPR", "HIV Screening"],
    },
    {
      title: "Clinical Chemistry",
      items: [
        "FBS / RBS",
        "SGOT / AST",
        "SGPT / ALT",
        "Lipid Profile",
        "Cholesterol",
        "Triglycerides",
        "HDL / LDL",
        "Creatinine",
        "BUN",
        "Uric Acid",
        "Sodium (NA)",
        "Potassium (K)",
        "Ionized Calcium (iCA)",
        "Bilirubin",
        "HbA1c",
      ],
      indentItems: [4, 5, 6],
    },
    { title: "Other", items: ["Others (Specify): ___________"] },
  ];

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="laboratoryRequestForm-grid d-flex justify-content-center align-items-center">
        <table className="laboratoryRequestForm-printout-table">
          <thead>
            <tr>
              <th colSpan={3}>
                <img
                  src={BannerURL}
                  alt="Banner"
                  className="laboratoryRequestForm-banner"
                />
              </th>
            </tr>
            <tr>
              <th
                colSpan={3}
                style={{ fontSize: "1rem" }}
                className="laboratoryRequestForm-font text-center"
              >
                PATIENT REQUEST FORM
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Patient Info */}

            <tr>
              <td colSpan={3} style={cellStyle}>
                <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  Name:
                </span>

                {/* Values */}
                <div style={valueRowStyle}>
                  <span>{user?.fullName?.lname || ""}</span>
                  <span>{user?.fullName?.fname || ""}</span>
                  <span>{user?.fullName?.mname || ""}</span>
                </div>

                {/* Labels with top border */}
                <div style={patientHeaderStyle}>
                  <span>Last Name</span>
                  <span>First Name</span>
                  <span>Middle Name</span>
                </div>
              </td>
            </tr>

            <tr style={{ height: "50px" }}>
              <td style={cellStyle}>
                Date of Birth:{" "}
                {dob ? new Date(dob).toLocaleDateString("en-US") : ""}
              </td>

              <td style={cellStyle}>
                Sex:{" "}
                {isMale === true ? "Male" : isMale === false ? "Female" : ""}
              </td>

              <td style={cellStyle}>Contact No:{mobile || ""}</td>
            </tr>

            <tr style={{ height: "50px" }}>
              <td colSpan={2} style={cellStyle}>
                Address: {address ? fullAddress(address) : ""}
              </td>
              <td style={cellStyle}>
                Physician:{physician ? fullName(physician.user.fullName) : ""}
              </td>
            </tr>

            {/* Tests Section */}
            <tr>
              <td colSpan={3} style={testCellStyle}>
                <div style={{ display: "flex", gap: "40px" }}>
                  <div style={{ flex: 1 }}>
                    {sectionsConfig.slice(0, 3).map((sec) => (
                      <Section
                        key={sec.title}
                        {...sec}
                        selections={selections}
                        toggleItem={toggleItem}
                      />
                    ))}
                  </div>
                  <div style={{ flex: 1 }}>
                    {sectionsConfig.slice(3).map((sec) => (
                      <Section
                        key={sec.title}
                        {...sec}
                        selections={selections}
                        toggleItem={toggleItem}
                      />
                    ))}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

const Section = ({
  title,
  items,
  selections,
  toggleItem,
  indentItems = [],
}) => (
  <div style={{ marginBottom: "16px" }}>
    <div style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: "8px" }}>
      {title}
    </div>
    {items.map((item, idx) => (
      <CheckboxRow
        key={idx}
        label={item}
        checked={selections[title]?.includes(item)}
        onClick={() => toggleItem(title, item)}
        indent={indentItems.includes(idx)}
      />
    ))}
  </div>
);

const CheckboxRow = ({ label, checked, onClick, indent }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      cursor: "pointer",
      marginBottom: "6px",
      fontSize: "0.9rem",
      marginLeft: indent ? "20px" : 0,
    }}
    onClick={onClick}
  >
    <div style={checkboxBox}>{checked ? "✓" : ""}</div>
    <span>{label}</span>
  </div>
);

const cellStyle = {
  border: "1px solid #000",
  padding: "6px",
  fontSize: "1rem",
  fontWeight: "bold",
};
const testCellStyle = {
  verticalAlign: "top",
  border: "1px solid #000",
  padding: "10px",
};
const checkboxBox = {
  width: "16px",
  height: "16px",
  border: "1.5px solid #000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: "bold",
  userSelect: "none",
};
const patientHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0 20px",
  borderTop: "2px solid black",
  fontSize: "0.85rem",
  paddingBottom: "10px",
  marginTop: "20px",
};
const valueRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "0 20px",
  marginTop: "2px", // small gap above the underline
  marginBottom: "-4px", // tuck values closer to line (adjust as needed)
  fontSize: "1rem",
  fontWeight: "bold",
  lineHeight: "1.2", // tighter spacing
};

export default RequestForm;
