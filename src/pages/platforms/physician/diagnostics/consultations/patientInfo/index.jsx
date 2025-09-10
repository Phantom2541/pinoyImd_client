import { useLocation, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  EditableUser,
  Select,
} from "../../../../../../components/customizable";
import PROFILE from "./../../../../../../assets/male.jpg";
import { fullAddress, getAge } from "../../../../../../services/utilities";

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
      <div className="checkup-data-patient-info">
        <img
          src={PROFILE}
          alt="avatar"
          className="checkup-data-patient-profile"
          draggable={false}
        />
        <EditableUser
          emptyLabel="Click here to select a Patient"
          user={{ patient, _id: patient?._id }}
          onSave={({ patient }) => setPatientId(patient)}
          formSubmitted={isLoading}
          isSuccess={isSuccess}
        />
      </div>
      <div className="checkup-data-patient-data">
        <span>Personal Details</span>
        <br />
        <span>
          Age: {getAge(patient?.dob)}/ {patient?.isMale ? "Male" : "Female"}
        </span>
        <br />
        <span>Address: {fullAddress(patient?.address)}</span>
      </div>
      <hr />
      <div>
        <span>
          Reason for Visit:{" "}
          <Select
            collection={
              ({ value: "initial", label: "New Consultation" },
              {
                value: "follow_up",
                label: "Follow-up Consultation",
              },
              {
                value: "ape",
                label: "Annual Physical Examination (APE)",
              },
              {
                value: "peme",
                label: "Pre-Employment Medical Examination",
              },
              {
                value: "poe",
                label: "Pre-Operative Evaluation",
              },
              {
                value: "med-clear",
                label: "Outpatient Medical Clearance",
              },
              {
                value: "med-cert",
                label: "Medical Certificate Issuance",
              },
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
              {
                value: "referral",
                label: "Referral from Another Physician",
              },
              { value: "s_ref", label: "Specialist Referral" },
              { value: "diagnostic_review", label: "Diagnostic Result Review" },
              { value: "wellness_check", label: "Wellness / Preventive Check" },
              { value: "health_screening", label: "Health Screening" },
              {
                value: "emergency",
                label: "Emergency Case (extra, optional)",
              })
            }
            soloUpdate={true}
            preValue={patient?.reasonForVisit}
            onChange={(value) =>
              setPatientId({ ...patient, reasonForVisit: value })
            }
          />
        </span>
      </div>
    </div>
  );
}
