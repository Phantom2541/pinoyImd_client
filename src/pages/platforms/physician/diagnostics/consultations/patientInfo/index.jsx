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
        <div className="checkup-data-patient-ageGender">
          <span>Male</span>
          <span>21 years</span>
        </div>
        <div className="checkup-data-patient-HWBMI">
          <div>
            <span>Height</span>
            <span>5'11 ft</span>
          </div>
          <div>
            <span>Weight</span>
            <span>89 kg</span>
          </div>
          <div>
            <span>BMI</span>
            <span>N/A</span>
          </div>
        </div>
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
            collection={[
              "New Consultation",
              "Follow-up Consultation",
              "Annual Physical Examination (APE)",
              "Pre-Employment Medical Examination",
              "Pre-Operative Evaluation",
              "Outpatient Medical Clearance",
              "Medical Certificate Issuance",
              "Consultation for Second Opinion",
              "Ongoing Treatment / Monitoring",
              "Post-Hospital / Discharge Follow-up",
              "Referral from Another Physician",
              "Specialist Referral",
              "Diagnostic Result Review",
              "Wellness / Preventive Check",
              "Health Screening",
            ]}
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
