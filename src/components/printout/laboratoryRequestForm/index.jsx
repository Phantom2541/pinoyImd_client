import React, { useEffect, useRef, useState } from "react";
import BANNER from "./../../../assets/banner.png";

const RequestFormPrint4x = () => {
  const [readyToPrint, setReadyToPrint] = useState(false);
  const containerRef = useRef(null);
  const itemStyle = { marginBottom: "4px" };

  // Preload banner
  useEffect(() => {
    const img = new Image();
    img.src = BANNER;
    img.onload = () => setReadyToPrint(true);
  }, []);

  // Trigger print when ready
  useEffect(() => {
    if (readyToPrint && containerRef.current) {
      setTimeout(() => window.print(), 200);
    }
  }, [readyToPrint]);

  const renderTable = () => (
    <table className="printout-table">
      <thead>
        <tr>
          <th colSpan={3}>
            <img src={BANNER} alt="Banner" className="printout-banner" />
          </th>
        </tr>
        <tr>
          <th colSpan={3} style={{ fontSize: "1.2rem" }}>PATIENT REQUEST FORM</th>
        </tr>
      </thead>
      <tbody>
        {/* Patient Info */}
        <tr>
          <td colSpan={3} style={{ padding: "0 10px", borderBottom: "2px solid black" }}>
            <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>Name:</span>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 20px",
              borderTop: "2px solid black",
              fontSize: ".8rem",
              paddingBottom: "10px",
              marginTop: "30px"
            }}>
              <span>Last Name</span>
              <span>First Name</span>
              <span>Middle Name</span>
            </div>
          </td>
        </tr>
        <tr style={{ height: "60px" }}>
          <td style={cellStyle}>Date of Birth:</td>
          <td style={cellStyle}>Sex:</td>
          <td style={cellStyle}>Contact No:</td>
        </tr>
        <tr style={{ height: "60px" }}>
          <td colSpan={2} style={cellStyle}>Address:</td>
          <td style={cellStyle}>Physician:</td>
        </tr>

        {/* Tests Section */}
        <tr>
          <td colSpan={3} style={{ padding: "6px" }}>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Hematology</div>
                <div style={itemStyle}>[ ] CBC</div>
                <div style={itemStyle}>[ ] CBC w/ APC</div>
                <div style={itemStyle}>[ ] Platelet Count</div>
                <div style={itemStyle}>[ ] Blood Typing</div>
                <div style={itemStyle}>[ ] ESR</div>

                <br />
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Clinical Microscopy</div>
                <div style={itemStyle}>[ ] Urinalysis</div>
                <div style={itemStyle}>[ ] Pregnancy Test</div>
                <div style={itemStyle}>[ ] Fecalysis</div>
                <div style={itemStyle}>[ ] Occult Blood</div>

                <br />
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Serology</div>
                <div style={itemStyle}>[ ] Dengue Duo</div>
                <div style={itemStyle}>[ ] HBsAG Screening</div>
                <div style={itemStyle}>[ ] VDAL / RPR</div>
                <div style={itemStyle}>[ ] HIV Screening</div>
              </div>

              <div style={{ flex: 1, minWidth: "200px" }}>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Clinical Chemistry</div>
                <div style={itemStyle}>[ ] FBS</div>
                <div style={itemStyle}>[ ] BUN</div>
                <div style={itemStyle}>[ ] Creatinine</div>
                <div style={itemStyle}>[ ] Cholesterol</div>
                <div style={itemStyle}>[ ] Triglycerides</div>
                <div style={itemStyle}>[ ] Uric Acid</div>
                <div style={itemStyle}>[ ] SGPT</div>
                <div style={itemStyle}>[ ] SGOT</div>

                <br />
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>Other</div>
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
      <div className="printout-grid">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="printout-copy">{renderTable()}</div>
        ))}
      </div>

      <style>{`
        @media print {
          @page { size: portrait; margin: 5mm; }
          body { margin: 0; padding: 0; }
          .printout-table { width: 100%; border-collapse: collapse; font-size: 12px; border: 1px solid #000; margin-bottom: 8px; }
          .printout-table td, .printout-table th { border: 1px solid #000; padding: 4px; text-align: left; }
          .printout-banner { width: 100%; max-height: 50px; object-fit: fill; }

          .printout-grid { display: flex; flex-wrap: wrap; gap: 5mm; }
          .printout-copy { width: 48%; box-sizing: border-box; }
        }
      `}</style>
    </div>
  );
};

const cellStyle = {
  border: "1px solid #000",
  padding: "4px",
  fontSize: "1.1rem",
  fontWeight: "bold",
};

export default RequestFormPrint4x;
