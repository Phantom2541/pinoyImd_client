import { useDispatch, useSelector } from "react-redux";
import { fullName, getAge } from "../../../../../../../services/utilities";
import { SetPATIENT } from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";

export default function Patient() {
  const { patient: appointment } = useSelector(
    ({ appointments }) => appointments
  );
  const { patient, consultation = {} } = appointment;
  const { vitals = {} } = consultation || {};
  const { prescription = {} } = consultation || {};
  const dispatch = useDispatch();

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
          <input
            type="text"
            value={vitals?.weight ? `${vitals?.weight} kg` : ""}
          />
        </div>
      </div>
      <div className="checkup-data-prescription-card-patient-info-row">
        <div className="checkup-data-prescription-card-input">
          <label>diagnosis:</label>
          <input
            type="text"
            placeholder="Enter Diagnosis"
            value={appointment?.diagnosis || ""}
            onChange={({ target }) => {
              const updatedPrescription = {
                ...prescription,
                diagnosis: target.value,
              };

              const updatedConsultation = {
                ...consultation,
                prescription: updatedPrescription,
              };

              const updatedAppointment = {
                ...appointment,
                consultation: updatedConsultation,
              };

              dispatch(SetPATIENT(updatedAppointment));
            }}
          />
        </div>
      </div>
    </div>
  );
}
