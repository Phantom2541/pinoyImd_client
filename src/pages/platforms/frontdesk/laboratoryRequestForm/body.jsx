import React from "react";
import BANNER from "./../../../../assets/banner.png"

const RequestForm = () => {
  const itemStyle = { marginBottom: "4px" };
  return (
    <div className="w-100">
      {/* <img src={BANNER} alt="" style={{width:"100%", height:"100%", objectFit:"fill"}} /> */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "12px",
          marginBottom: "20px",
          border: "1px solid #000",
        }}
      >
        <tbody>
          {/* Patient Info */}
          <tr>
            <td colSpan={3} style={{ border: "1px solid #000", padding: "0 10px" }}>
            <span style={{fontSize:"1.1rem", fontWeight:"bold"}}>Name:</span>
              <div style={{ display: "flex", justifyContent: "space-between", padding:"0 20px", borderTop:"2px solid black", fontSize:".8rem", paddingBottom:"10px", marginTop:"30px" }}>
                <span>Last Name</span>
                <span>First Name</span>
                <span>Middle Name</span>
              </div>
            </td>
          </tr>
          <tr style={{ height: "60px"}}>
            <td style={{ border: "1px solid #000", padding: "4px", fontSize: "1.1rem", fontWeight: "bold" }}>Date of Birth:</td>
            <td style={{ border: "1px solid #000", padding: "4px",fontSize: "1.1rem", fontWeight: "bold" }}>Sex:</td>
            <td style={{ border: "1px solid #000", padding: "4px",fontSize: "1.1rem", fontWeight: "bold" }}>Contact No:</td>
          </tr>
          <tr style={{ height: "60px"}}>
            <td colSpan={2} style={{ border: "1px solid #000", padding: "4px",fontSize: "1.1rem", fontWeight: "bold" }}>Address:</td>
            <td style={{ border: "1px solid #000", padding: "4px",fontSize: "1.1rem", fontWeight: "bold" }}>Physician:</td>
          </tr>

          {/* Tests Section */}
          <tr>
            <td
              style={{ verticalAlign: "top", border: "1px solid #000", padding: "6px" }}
              colSpan={3}
            >
              <div style={{ display: "flex", gap: "40px" }}>
                {/* Left Column */}
            {/* Left Column */}
<div style={{ flex: 1 }}>
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

{/* Right Column */}
<div style={{ flex: 1 }}>
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
    </div>
  );
};

export default RequestForm;
