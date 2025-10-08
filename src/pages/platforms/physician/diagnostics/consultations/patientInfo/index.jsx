import { useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  EditableSelect,
  EditableUser,
  EditableField,
} from "../../../../../../components/customizable";
import {
  Cloudinary,
  fullAddress,
  fullName,
  getAge,
  PresetImage,
} from "../../../../../../services/utilities";
import "./style.css";
import { MDBIcon } from "mdbreact";
import Swal from "sweetalert2";
import {
  SAVE,
  SetCLUSTER,
  SetPATIENT,
} from "../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { useState } from "react";
import Register from "./register";
import { VisityType } from "../../../../../../services/fakeDb";
import diagnostic from "../../../../../../services/fakeDb/sidebars/diagnostics/diagnostic";
import { computeBMI } from "../clinicalData/vital/sweetVs";

export default function Patient({ activePanels }) {
  const { token, auth } = useSelector(({ auth }) => auth),
    {
      patient: appointment,
      formSubmitted,
      isSuccess,
      cluster = [],
    } = useSelector(({ appointments }) => appointments),
    dispatch = useDispatch();

  const [isRegister, setIsRegister] = useState(false),
    [searchValue, setSearchValue] = useState({});
  const location = useLocation();
  const history = useHistory();
  const { consultation = {}, patient = {} } = appointment || {};
  const { vitals } = consultation || {};
  const { height = {}, weight = {} } = vitals || {};
  // const [feet, inches] = String(vitals?.height)?.split("'").map(Number);
  // const meters = (feet * 12 + (inches || 0)) * 0.0254;
  // const rawBmi = vitals.weight / meters ** 2;
  // const bmi = Number.isFinite(rawBmi) ? rawBmi.toFixed(2) : 0;
  const bmi = computeBMI({ height, weight });

  const setPatient = (patient) => {
    Swal.fire({
      title: "Create Appointment",
      html: `
  <div style="text-align:left; line-height:1.5; font-size:15px;"  class="text-center">
    <p style="margin:0 0 12px 0;">
      You have selected 
      <span style="
        display:inline-block; 
        padding:3px 8px; 
        margin-left:6px;
        font-weight:700; 
        color:#1d4ed8; 
        background:#e0ebff; 
        border-radius:6px;">
        ${fullName(patient.fullName)}
      </span>
    </p>

    <p style="margin:0; font-size:15px;">
      Do you want to create a new appointment for the schedule on
      <span style="
        display:inline-block; 
        padding:3px 8px; 
        margin-left:6px;
        font-weight:700; 
        color:#047857; 
        background:#dcfce7; 
        border-radius:6px;">
        ${appointment.sched ?? "<em>— no schedule —</em>"}
      </span>
      ?
    </p>
  </div>
`,
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
          status: "confirmed",
        };

        dispatch(SAVE({ data: newAppt, token })).then((action) => {
          const { payload } = action.payload;
          const _cluster = [...(cluster || [])];
          const apptIndex = _cluster.findIndex(
            (p) => p._id === appointment?._id
          );
          if (apptIndex !== -1) {
            _cluster.splice(apptIndex + 1, 0, payload);
          } else {
            _cluster.push(payload);
          }
          const newParams = new URLSearchParams(location.search);
          newParams.set("ehrId", payload?._id); // add if missing, replace if exists
          history.replace(`${location.pathname}?${newParams.toString()}`);
          Swal.fire({
            title: "Appointment Created!",
            text: `Successfully created an appointment for ${fullName(
              patient.fullName
            )} on schedule ${appointment.sched}.`,
            icon: "success",
            confirmButtonText: "OK",
          });
          dispatch(SetCLUSTER(_cluster));
          dispatch(SetPATIENT(payload));
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
          src={userUrl}
          onError={(e) => (e.target.src = PresetImage(patient?.isMale))}
          alt="avatar"
          className="checkup-data-patient-profile"
          draggable={false}
        />
        <EditableUser
          classNameTxt="checkup-data-patient-fullname"
          emptyLabel="Click here to select a Patient"
          user={{ patient, _id: patient?._id }}
          hasRegister
          onSave={({ patient }) => setPatient(patient)}
          returnObj
          setRegister={(value) => {
            setSearchValue(value);
            setIsRegister(true);
          }}
          formSubmitted={formSubmitted}
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
          <span>{(parseFloat(vitals?.height) / 100).toFixed(2)} m</span>
        </div>
        <div>
          <span>Weight</span>
          <span>{vitals?.weight} kg</span>
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
          collections={VisityType.collections}
          keyForValue="value"
          keyForText="label"
          preValue={appointment?.visitType}
          onChange={(value) =>
            dispatch(SetPATIENT({ ...appointment, visitType: value }))
          }
        />
      </div>
      <div
        className="checkup-data-patient-reason"
        style={{
          borderColor: patient?.isMale ? "#007bff" : "#e83e8c",
        }}
      >
        <label style={{ color: patient?.isMale ? "#007bff" : "#e83e8c" }}>
          Diagnosis :
        </label>
        {/* <EditableField
          keyForValue="value"
          keyForText="label"
          onChange={(value) => {
            console.log(`value`, value);
            dispatch(SetPATIENT({ ...appointment, diagnosis: value }));
          }}
          isSuccess={isSuccess}
          formSubmitted={formSubmitted}
        /> */}
        <EditableField
          fieldData={{
            diagnosis: appointment?.diagnosis || "",
          }}
          placeholder="Diagnosis"
          onSave={(value) =>
            dispatch(SetPATIENT({ ...appointment, diagnosis: value.diagnosis }))
          }
          isSuccess={isSuccess}
          formSubmitted={formSubmitted}
        />
      </div>
      <Register
        searchValue={searchValue}
        show={isRegister}
        toggle={() => setIsRegister(false)}
      />
    </div>
  );
}
