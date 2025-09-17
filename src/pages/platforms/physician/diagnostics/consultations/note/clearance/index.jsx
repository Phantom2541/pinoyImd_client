import React from "react";
import usePanelPosition from "../panelPosition";
import { MDBIcon } from "mdbreact";
import "./../style.css";

export default function Clearance({
  active,
  buttonRefs,
  patient,
  doctor,
  diagnosis,
  date,
  togglePanel,
}) {
  const style = usePanelPosition(active, buttonRefs.clearance, {
    width: 800,
    height: 483,
  });

  return (
    <div
      style={{
        ...style,
      }}
      className="checkup-data-clearance"
    >
      <MDBIcon
        icon="times"
        className="checkup-data-note-close"
        onClick={() => togglePanel("clearance")}
      />
      <div
        className="medical-cert border p-6 bg-white shadow-md rounded-xl"
        style={{
          width: "800px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">ABC Medical Clinic</h2>
          <p>123 Main St., Quezon City</p>
          <p>Contact: (02) 1234-5678</p>
          <hr className="my-4" />
          <h3 className="text-lg font-semibold underline">
            MEDICAL CERTIFICATE
          </h3>
        </div>

        {/* Body */}
        <div className="leading-relaxed text-justify mb-8">
          <p>
            This is to certify that <b>{patient?.name || "________________"}</b>
            , {patient?.age ? `${patient.age} years old` : "___ years old"},{" "}
            {patient?.gender || "______"} was examined and treated at this
            clinic on <b>{date || "_________"}</b>.
          </p>

          <p className="mt-4">
            Findings/Diagnosis: <b>{diagnosis || "____________________"}</b>
          </p>

          <p className="mt-4">
            He/She is advised to take a rest/sick leave for{" "}
            <b>{patient?.restDays || "____"}</b> day(s).
          </p>
        </div>

        {/* Footer */}
        <div className="text-right mt-12">
          <p>______________________________</p>
          <p>
            <b>{doctor?.name || "Dr. Juan Dela Cruz"}</b>
          </p>
          <p>
            Lic. No.: <b>{doctor?.license || "000000"}</b>
          </p>
        </div>
      </div>
    </div>
  );
}
