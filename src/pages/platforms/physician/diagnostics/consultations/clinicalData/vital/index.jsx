import "./../style.css";
import { UPDATE } from "../../../../../../../services/redux/slices/diagnostics/clinic/consultations";
import {
  SetCLUSTER,
  SetPATIENT,
} from "../../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { useDispatch, useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { useEffect } from "react";
import { MDBBtn, MDBIcon } from "mdbreact";
import { handleAddVitals, computeBMI, classifyBMI, bmiColor } from "./sweetVs";

const vitalsConfig = {
  temp: {
    label: "Temperature",
    unit: "°C",
    hint: "Normal: 36.5 – 37.5 ",
  },
  bp: {
    label: "Blood Pressure",
    unit: "mmHg",
    hint: "Normal: ~120/80",
  },
  rr: {
    label: "Respiratory Rate",
    unit: "brpm",
    hint: "Normal: 12 – 20",
  },
  pr: {
    label: "Pulse Rate",
    unit: "bpm",
    hint: "Normal: 60 – 100",
  },
  hr: {
    label: "Heart Rate",
    unit: "bpm",
    hint: "Normal: 60 – 100",
  },
};
export default function VitalSign() {
  const { patient: appointment, cluster } = useSelector(
    ({ appointments }) => appointments
  );
  const { token } = useSelector(({ auth }) => auth);
  const { isSuccess } = useSelector(({ consultations }) => consultations);
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const vitalSigns = appointment?.consultation?.vitals || {};

  useEffect(() => {
    if (isSuccess) {
      addToast("Vital signs successfully updated.", { appearance: "success" });
    }
  }, [isSuccess, addToast]);

  const handleAdd = async () => {
    const vitals = await handleAddVitals(vitalsConfig);

    if (vitals) {
      const payload = {
        patient: appointment.patient._id,
        appointment: appointment._id,
        ...appointment.consultation,
        vitals,
      };

      dispatch(UPDATE({ data: payload, token })).then(({ payload }) => {
        const _cluster = [...cluster];
        const apptIndex = _cluster.findIndex((p) => p._id === appointment?._id);
        _cluster[apptIndex] = { ...appointment, consultation: payload };

        dispatch(SetCLUSTER(_cluster));
        dispatch(SetPATIENT({ ...appointment, consultation: payload }));
      });
    }
  };

  if (!vitalSigns || Object.keys(vitalSigns).length === 0) {
    return (
      <div className="checkup-data-pmh-container d-flex flex-column justify-content-center align-items-center text-center h-100">
        <h3 className="mb-3">No vital signs registered.</h3>

        <div style={{ marginTop: "5px", lineHeight: "1.8" }}>
          <span style={{ fontWeight: "bold" }}>BP:</span> ______ mmHg <br />
          <span style={{ fontWeight: "bold" }}>PR/HR:</span> ______ bpm <br />
          <span style={{ fontWeight: "bold" }}>RR:</span> ______ cpm <br />
          <span style={{ fontWeight: "bold" }}>Temp:</span> ______ °C <br />
          <span style={{ fontWeight: "bold" }}>Ht:</span> ______ cm <br />
          <span style={{ fontWeight: "bold" }}>Wt:</span> ______ kg <br />
        </div>

        <h3 className="mt-3">Please add vital signs.</h3>
        <MDBBtn rounded color="primary" size="sm" onClick={handleAdd}>
          <MDBIcon icon="plus" /> Add
        </MDBBtn>
      </div>
    );
  }

  const { weight, height, ...otherVitals } = vitalSigns;
  console.log("Vital signs: ", vitalSigns);

  const bmi = computeBMI({ height, weight });
  const bmiClass = classifyBMI(bmi);
  const bmiStyle = bmiColor(bmi);
  return (
    <div className="vital-sign-container">
      <div className="vital-signs-wrapper">
        <h2>Vital Signs</h2>
        <table className="vital-signs-table">
          <tbody>
            {Object.entries(otherVitals).map(([key, value]) => {
              const { label, unit } = vitalsConfig[key];
              return (
                <tr key={key}>
                  <td className="vital-label">{label}</td>
                  <td className="vital-value">{`${value} ${unit}`}</td>
                </tr>
              );
            })}
            {bmi && (
              <tr>
                <td className="vital-label">BMI</td>
                <td className={`vital-value ${bmiStyle}`}>
                  {bmi} ({bmiClass})
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper to convert camelCase to Normal Text
function formatLabel(label) {
  return label
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}
