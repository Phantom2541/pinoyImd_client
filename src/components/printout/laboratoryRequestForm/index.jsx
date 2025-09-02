import { useEffect, useRef, useState } from "react";
import { Cloudinary } from "../../../services/utilities";
import { useSelector } from "react-redux";

const RequestFormPrint4x = () => {
  const { activePlatform = {} } = useSelector(({ auth }) => auth);
  console.log("activePlatform", activePlatform);

  let obj;
  if (typeof activePlatform === "string") {
    obj = JSON.parse(activePlatform);
  } else {
    obj = activePlatform;
  }

  const companyName = obj?.company?.name;
  const branchName = obj?.branch?.name;

  const [readyToPrint, setReadyToPrint] = useState(false);
  const containerRef = useRef(null);
  const itemStyle = { marginBottom: "4px" };
  const BannerURL = `${Cloudinary.getEndpoint()}/companies/${encodeURIComponent(
    companyName
  )}//${encodeURIComponent(branchName)}/banner`;

  // Preload banner
  useEffect(() => {
    const img = new Image();
    img.src = BannerURL;
    img.onload = () => setReadyToPrint(true);
  }, []);

  // Trigger print when ready
  useEffect(() => {
    if (readyToPrint && containerRef.current) {
      setTimeout(() => window.print(), 200);
    }
  }, [readyToPrint]);

  const renderTable = () => (
    <table className="laboratoryRequestForm-printout-table">
      <thead>
        <tr>
          <th colSpan={3}>
            <img
              src={BannerURL}
              alt="Banner"
              className="laboratoryRequestForm-printout-banner"
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
            style={{
              padding: "0 10px",
            }}
          >
            <span
              className="laboratoryRequestForm-font"
              style={{ fontSize: "1rem", fontWeight: "bold" }}
            >
              Name:
            </span>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "2px solid black",
                fontSize: ".8rem",
                paddingLeft: "50px",
                marginTop: "10px",
              }}
            >
              <span>Last Name</span>
              <span>First Name</span>
              <span>Middle Name</span>
            </div>
          </td>
        </tr>
        <tr style={{ height: "40px" }}>
          <td style={cellStyle} className="laboratoryRequestForm-font">
            Date of Birth:
          </td>
          <td style={cellStyle} className="laboratoryRequestForm-font">
            Sex:
          </td>
          <td style={cellStyle} className="laboratoryRequestForm-font">
            Contact No:
          </td>
        </tr>
        <tr style={{ height: "40px" }}>
          <td
            colSpan={2}
            style={cellStyle}
            className="laboratoryRequestForm-font"
          >
            Address:
          </td>
          <td style={cellStyle} className="laboratoryRequestForm-font">
            Physician:
          </td>
        </tr>

        {/* Tests Section */}
        <tr>
          <td colSpan={3} style={{ padding: "6px" }}>
            <div
              style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                fontSize: ".8rem",
              }}
            >
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Hematology
                </div>
                <div style={itemStyle}>[ ] CBC</div>
                <div style={itemStyle}>[ ] CBC w/ APC</div>
                <div style={itemStyle}>[ ] Platelet Count</div>
                <div style={itemStyle}>[ ] Blood Typing</div>
                <div style={itemStyle}>[ ] ESR</div>

                <br />
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Clinical Microscopy
                </div>
                <div style={itemStyle}>[ ] Urinalysis</div>
                <div style={itemStyle}>[ ] Pregnancy Test</div>
                <div style={itemStyle}>[ ] Fecalysis</div>
                <div style={itemStyle}>[ ] Occult Blood</div>

                <br />
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Serology
                </div>
                <div style={itemStyle}>[ ] Dengue Duo</div>
                <div style={itemStyle}>[ ] HBsAG Screening</div>
                <div style={itemStyle}>[ ] VDAL / RPR</div>
                <div style={itemStyle}>[ ] HIV Screening</div>
              </div>

              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Clinical Chemistry
                </div>
                <div>[ ] SGOT / AST</div>
                <div>[ ] SGPT / ALT</div>
                <div>[ ] Lipid Profile</div>
                <div style={{ marginLeft: "20px" }}>[ ] Cholesterol</div>
                <div style={{ marginLeft: "20px" }}>[ ] Triglycerides</div>
                <div style={{ marginLeft: "20px" }}>[ ] HDL / LDL</div>
                <div>[ ] Creatinine</div>
                <div>[ ] BUN</div>
                <div>[ ] Uric Acid</div>
                <div>[ ] Sodium (NA)</div>
                <div>[ ] Potassium (K)</div>
                <div>[ ] Ionized Calcium (iCA)</div>
                <div>[ ] Bilirubin</div>
                <div>[ ] HbA1c</div>
                <br />
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Other
                </div>
                <div style={itemStyle}>[ ] Others (Specify): ___________</div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }} ref={containerRef}>
      <div className="laboratoryRequestForm-printout-grid d-flex justify-content-center align-items-center">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="laboratoryRequestForm-printout-copy">
            {renderTable()}
          </div>
        ))}
      </div>

      <style>{`
        @media print {
          @page { size: portrait; margin: 5mm; }
          body { margin: 0; padding: 0; }
          .laboratoryRequestForm-printout-table { width: 100%; border-collapse: collapse; border: 1px solid #000; margin-bottom: 8px; }
          .laboratoryRequestForm-printout-table td, .laboratoryRequestForm-printout-table th { border: 1px solid #000; padding: 4px; text-align: left; }
          .laboratoryRequestForm-printout-banner { width: 100%; max-height: 50px; object-fit: fill; }

          .laboratoryRequestForm-printout-grid { display: flex; flex-wrap: wrap; gap: 5mm; }
          .laboratoryRequestForm-printout-copy { width: 48%; box-sizing: border-box; }
          .laboratoryRequestForm-font{ font-size: .8rem !important; }
        }
      `}</style>
    </div>
  );
};

const cellStyle = {
  border: "1px solid #000",
  padding: "4px",
  fontSize: "1rem",
  fontWeight: "bold",
};

export default RequestFormPrint4x;
