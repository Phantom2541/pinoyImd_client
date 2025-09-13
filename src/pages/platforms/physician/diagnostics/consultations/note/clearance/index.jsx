import React from "react";
import usePanelPosition from "../panelPosition";

export default function Clearance({
  active,
  buttonRefs,
  patient,
  doctor,
  purpose,
  date,
}) {
  const style = usePanelPosition(active, buttonRefs.clearance);

  return (
    <div
      style={{
        ...style,
        width: "600px",
        padding: "20px",
        backgroundColor: "white",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        borderRadius: "10px",
        fontFamily: "Arial, sans-serif",
      }}
      className="checkup-data-clearance"
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>ABC Medical Clinic</h2>
        <p style={{ margin: 0 }}>123 Main St., Quezon City</p>
        <hr style={{ margin: "10px 0" }} />
        <h3 style={{ textDecoration: "underline", margin: 0 }}>
          MEDICAL CLEARANCE
        </h3>
      </div>

      {/* Body */}
      <div style={{ lineHeight: 1.6 }}>
        <p>
          This is to certify that <b>{patient?.name || "________________"}</b>,{" "}
          {patient?.age ? `${patient.age} years old` : "___ years old"},{" "}
          {patient?.gender || "______"} has undergone medical examination at
          this clinic.
        </p>

        <p>
          Purpose of clearance: <b>{purpose || "____________________"}</b>
        </p>

        <p>
          Date of issuance: <b>{date || "__________"}</b>
        </p>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "right", marginTop: "30px" }}>
        <p>______________________________</p>
        <p>
          <b>{doctor?.name || "Dr. Juan Dela Cruz"}</b>
        </p>
        <p>
          Lic. No.: <b>{doctor?.license || "000000"}</b>
        </p>
      </div>
    </div>
  );
}
