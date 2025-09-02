import React from "react";
import { useSelector } from "react-redux";
import { Cloudinary } from "../../../../../services/utilities";

const RequestForm = () => {
  const { activePlatform = {} } = useSelector(({ auth }) => auth);

  const companyName = activePlatform?.branch?.companyId?.name;
  const branchName = activePlatform?.branch?.name;

  const BannerURL = `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
    companyName
  )}//${encodeURIComponent(branchName)}/banner`;

  const itemStyle = { marginBottom: "6px", fontSize: "0.9rem" };

  const cellStyle = {
    border: "1px solid #000",
    padding: "6px",
    fontSize: "1rem",
    fontWeight: "bold",
  };

  const renderTable = () => (
    // <table
    //   className="laboratoryRequestForm-table"
    //   style={{
    //     width: "100%",
    //     borderCollapse: "collapse",
    //     fontSize: "13px",
    //     marginBottom: "20px",
    //     border: "1px solid #000",
    //   }}
    // >
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
          <td
            colSpan={3}
            style={{ border: "1px solid #000", padding: "6px 10px" }}
          >
            <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              Name:
            </span>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 20px",
                borderTop: "2px solid black",
                fontSize: "0.85rem",
                paddingBottom: "10px",
                marginTop: "20px",
              }}
            >
              <span>Last Name</span>
              <span>First Name</span>
              <span>Middle Name</span>
            </div>
          </td>
        </tr>

        <tr style={{ height: "50px" }}>
          <td style={cellStyle}>Date of Birth:</td>
          <td style={cellStyle}>Sex:</td>
          <td style={cellStyle}>Contact No:</td>
        </tr>

        <tr style={{ height: "50px" }}>
          <td colSpan={2} style={cellStyle}>
            Address:
          </td>
          <td style={cellStyle}>Physician:</td>
        </tr>

        {/* Tests Section */}
        <tr>
          <td
            style={{
              verticalAlign: "top",
              border: "1px solid #000",
              padding: "10px",
            }}
            colSpan={3}
          >
            <div style={{ display: "flex", gap: "40px" }}>
              {/* Left Column */}
              <div style={{ flex: 1 }}>
                <Section
                  title="Hematology"
                  items={[
                    "CBC",
                    "CBC w/ APC",
                    "Platelet Count",
                    "Blood Typing",
                    "ESR",
                  ]}
                  itemStyle={itemStyle}
                />

                <Section
                  title="Clinical Microscopy"
                  items={[
                    "Urinalysis",
                    "Pregnancy Test",
                    "Fecalysis",
                    "Occult Blood",
                  ]}
                  itemStyle={itemStyle}
                />

                <Section
                  title="Serology"
                  items={[
                    "Dengue Duo",
                    "HBsAG Screening",
                    "VDAL / RPR",
                    "HIV Screening",
                  ]}
                  itemStyle={itemStyle}
                />
              </div>

              {/* Right Column */}
              <div style={{ flex: 1 }}>
                <Section
                  title="Clinical Chemistry"
                  items={[
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
                  ]}
                  itemStyle={itemStyle}
                  indentItems={[4, 5, 6]}
                />

                <Section
                  title="Other"
                  items={["Others (Specify): ___________"]}
                  itemStyle={itemStyle}
                />
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div className="laboratoryRequestForm-grid d-flex justify-content-center align-items-center">
        <div className="laboratoryRequestForm-copy">{renderTable()}</div>
      </div>
    </div>
  );
};

const Section = ({ title, items, itemStyle, indentItems = [] }) => (
  <div style={{ marginBottom: "16px" }}>
    <div style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: "8px" }}>
      {title}
    </div>
    {items.map((item, idx) => (
      <div
        key={idx}
        style={{
          ...itemStyle,
          marginLeft: indentItems.includes(idx) ? "20px" : 0,
        }}
      >
        [ ] {item}
      </div>
    ))}
  </div>
);

export default RequestForm;
