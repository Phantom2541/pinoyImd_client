import { useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  EditableSelect,
  EditableUser,
} from "../../../../../../components/customizable";
import PROFILE from "./../../../../../../assets/male.jpg";
import { fullAddress, getAge } from "../../../../../../services/utilities";
import "./style.css";
import { MDBIcon } from "mdbreact";

export default function Patient({ activePanels }) {
  const { patient, isLoading, isSuccess } = useSelector(
    ({ consultations }) => consultations
  );
  const location = useLocation();
  const history = useHistory();

  const setPatientId = (newId) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("ehrId", newId); // add if missing, replace if exists
    history.replace(`${location.pathname}?${newParams.toString()}`);
  };
  return (
    <div
      className={`checkup-data-patient ${
        Object.values(activePanels).some(Boolean) && "active"
      }`}
    >
      <div
        className="checkup-data-patient-info"
        style={{ backgroundColor: patient?.isMale ? "#007bff" : "#FFC107" }}
      >
        <img
          src={PROFILE}
          alt="avatar"
          className="checkup-data-patient-profile"
          draggable={false}
        />
        <EditableUser
          classNameTxt="checkup-data-patient-fullname"
          emptyLabel="Click here to select a Patient"
          user={{ patient, _id: patient?._id }}
          onSave={({ patient }) => setPatientId(patient)}
          formSubmitted={isLoading}
          isSuccess={isSuccess}
        />
        <span className="checkup-data-patient-ageGender">
          {getAge(patient?.dob)}&nbsp;|&nbsp;
          {patient?.isMale ? "Male" : "Female"}
        </span>
      </div>
      <div className="checkup-data-patient-HWBMI">
        <div>
          <span>Height</span>
          <span>5'11 ft</span>
        </div>
        <div>
          <span>Weight</span>
          <span>89 KG</span>
        </div>
        <div>
          <span>BMI</span>
          <span>N/A</span>
        </div>
      </div>
      <div className="checkup-data-patient-address">
        <label>Address Information</label>
        <span>
          <MDBIcon icon="location" />
          {fullAddress(patient?.address)}
        </span>
      </div>
      <div className="checkup-data-patient-reason">
        <label>Reason for Visit:</label>
        <EditableSelect
          collections={[
            { value: "initial", label: "New Consultation" },
            { value: "follow_up", label: "Follow-up Consultation" },
            { value: "ape", label: "Annual Physical Examination (APE)" },
            { value: "peme", label: "Pre-Employment Medical Examination" },
            { value: "poe", label: "Pre-Operative Evaluation" },
            { value: "med-clear", label: "Outpatient Medical Clearance" },
            { value: "med-cert", label: "Medical Certificate Issuance" },
            {
              value: "second_opinion",
              label: "Consultation for Second Opinion",
            },
            {
              value: "ongoing_treatment",
              label: "Ongoing Treatment / Monitoring",
            },
            {
              value: "ph_follow_up",
              label: "Post-Hospital / Discharge Follow-up",
            },
            { value: "referral", label: "Referral from Another Physician" },
            { value: "s_ref", label: "Specialist Referral" },
            { value: "diagnostic_review", label: "Diagnostic Result Review" },
            { value: "wellness_check", label: "Wellness / Preventive Check" },
            { value: "health_screening", label: "Health Screening" },
            { value: "emergency", label: "Emergency Case (extra, optional)" },
          ]}
          keyForValue="value"
          keyForText="label"
          preValue={patient?.reasonForVisit}
          onChange={(value) =>
            setPatientId({ ...patient, reasonForVisit: value })
          }
        />
      </div>
    </div>
  );
}
