import React from "react";
import { useSelector } from "react-redux";
import { fullName, getAge } from "../../../../../../../services/utilities";

export default function Patient() {
  const { patient } = useSelector(({ consultations }) => consultations);
  console.log("here patient", patient);

  const today = new Date();

  // kuha ng buwan, araw, at taon
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const year = today.getFullYear();

  // final format MM/DD/YYYY
  const formattedDate = `${month}/${day}/${year}`;

  return (
    <div className="checkup-data-prescription-card-patient-info">
      <div className="checkup-data-prescription-card-patient-info-row">
        <div className="checkup-data-prescription-card-input">
          <label>name:</label>
          <input
            type="text"
            value={fullName(patient?.fullName).toLowerCase()}
          />
        </div>
        <div
          className="checkup-data-prescription-card-input"
          style={{ width: "35%" }}
        >
          <label>date:</label>
          <input type="text" value={formattedDate} />
        </div>
      </div>
      <div className="checkup-data-prescription-card-patient-info-row">
        <div className="checkup-data-prescription-card-input">
          <label>Age:</label>
          <input type="text" value={getAge(patient?.dob)} />
        </div>
        <div className="checkup-data-prescription-card-input">
          <label>Gender:</label>
          <input type="text" value={patient?.isMale ? "Male" : "Female"} />
        </div>
        <div className="checkup-data-prescription-card-input">
          <label>Weight:</label>
          <input type="text" value="85 kg" />
        </div>
      </div>
      <div className="checkup-data-prescription-card-patient-info-row">
        <div className="checkup-data-prescription-card-input">
          <label>diagnosis:</label>
          <input type="text" value="diabetes" />
        </div>
      </div>
    </div>
  );
}
