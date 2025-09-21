import { useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  EditableSelect,
  EditableUser,
} from "../../../../../../components/customizable";
import PROFILE from "./../../../../../../assets/male.jpg";
import {
  Cloudinary,
  fullAddress,
  fullName,
  getAge,
} from "../../../../../../services/utilities";
import "./style.css";
import { MDBIcon } from "mdbreact";
import Swal from "sweetalert2";
import { SAVE } from "../../../../../../services/redux/slices/diagnostics/clinic/appointments";

export default function Patient({ activePanels }) {
  const { token, auth } = useSelector(({ auth }) => auth),
    { isLoading, isSuccess } = useSelector(
      ({ consultations }) => consultations
    ),
    { patient: appointment } = useSelector(({ appointments }) => appointments),
    dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { consultation = {}, patient = {} } = appointment || {};
  const { vitals = { height: 0, weight: 0 } } = consultation || {};

  // --- Safe height parsing ---
  let feet = 0,
    inches = 0;

  if (typeof vitals.height === "string" && vitals.height.includes("'")) {
    [feet, inches] = vitals.height.split("'").map(Number);
  } else if (typeof vitals.height === "number" && vitals.height > 0) {
    // assume cm → convert to ft/in
    const totalInches = vitals.height / 2.54;
    feet = Math.floor(totalInches / 12);
    inches = Math.round(totalInches % 12);
  }

  const meters = (feet * 12 + (inches || 0)) * 0.0254 || 0;
  const bmi = meters > 0 ? (vitals.weight / meters ** 2).toFixed(2) : "N/A";

  const setPatient = (patient) => {
    Swal.fire({
      title: "Create Appointment",
      text: `You selected ${fullName(
        patient.fullName
      )}. Do you want to create a new appointment for schedule ${
        appointment.sched
      }?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, create",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const newqn = parseFloat((appointment.qn + 0.1).toFixed(1));
        const newAppt = {
          patient: patient._id,
          clinic: appointment.clinic,
          sched: appointment.sched,
          qn: newqn,
          userId: auth._id,
        };

        dispatch(SAVE({ data: newAppt, token })).then((action) => {
          Swal.fire({
            title: "Appointment Created!",
            text: `Successfully created an appointment for ${fullName(
              patient.fullName
            )} on schedule ${appointment.sched}.`,
            icon: "success",
            confirmButtonText: "OK",
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        console.log("Appointment creation canceled.");
      }
    });
  };

  const userUrl = `${Cloudinary.getEndpoint()}/users/${patient.email}/profile`;

  return (
    <div
      className={`checkup-data-patient ${
        Object.values(activePanels).some(Boolean) && "active"
      }`}
    >
      <div
        className="checkup-data-patient-info"
        style={{ backgroundColor: patient?.isMale ? "#007bff" : "#e83e8c" }}
      >
        <img
          src={userUrl || PROFILE}
          alt="avatar"
          className="checkup-data-patient-profile"
          draggable={false}
        />
        <EditableUser
          classNameTxt="checkup-data-patient-fullname"
          emptyLabel="Click here to select a Patient"
          user={{ patient, _id: patient?._id }}
          onSave={({ patient }) => setPatient(patient)}
          returnObj
          formSubmitted={isLoading}
          isSuccess={isSuccess}
        />
        <span className="checkup-data-patient-ageGender">
          {getAge(patient?.dob)}&nbsp;|&nbsp;
          {patient?.isMale ? "Male" : "Female"}
        </span>
      </div>

      <div
        className="checkup-data-patient-HWBMI"
        style={{ backgroundColor: patient?.isMale ? "#007bff" : "#e83e8c" }}
      >
        <div>
          <span>Height</span>
          <span>
            {feet}'{inches}"
          </span>
        </div>
        <div>
          <span>Weight</span>
          <span>{vitals.weight} kg</span>
        </div>
        <div>
          <span>BMI</span>
          <span>{bmi}</span>
        </div>
      </div>

      <div
        className="checkup-data-patient-address"
        style={{
          borderColor: patient?.isMale ? "#007bff" : "#e83e8c",
        }}
      >
        <label style={{ color: patient?.isMale ? "#007bff" : "#e83e8c" }}>
          Address Information
        </label>
        <span>
          <MDBIcon icon="location" />
          {fullAddress(patient?.address)}
        </span>
      </div>

      <div
        className="checkup-data-patient-reason"
        style={{
          borderColor: patient?.isMale ? "#007bff" : "#e83e8c",
        }}
      >
        <label style={{ color: patient?.isMale ? "#007bff" : "#e83e8c" }}>
          Reason for Visit:
        </label>
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
        />
      </div>
    </div>
  );
}
