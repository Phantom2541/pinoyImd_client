import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBRow,
  MDBCol,
} from "mdbreact";
import {
  SET_VS,
  TOGGLEVS,
} from "../../../../../services/redux/slices/diagnostics/clinic/appointments";
import Spinner from "../../../../../components/spinner";
import { fullName } from "../../../../../services/utilities";

const fields = [
  {
    key: "temp",
    label: "Temperature",
    unit: "°C",
    hint: "Normal: 36.5 – 37.5 ",
  },
  {
    key: "bp",
    label: "Blood Pressure",
    unit: "mmHg",
    type: "text",
    hint: "Normal: ~120/80",
  },
  {
    key: "rr",
    label: "Respiratory Rate",
    unit: "breaths/min",
    hint: "Normal: 12 – 20",
  },
  { key: "pr", label: "Pulse Rate", unit: "bpm", hint: "Normal: 60 – 100" },
  { key: "hr", label: "Heart Rate", unit: "bpm", hint: "Normal: 60 – 100" },
  { key: "weight", label: "Weight", unit: "kg", hint: "1 kg ≈ 2.205 lbs" },
  {
    key: "height",
    label: "Height",
    unit: "cm",
    hint: "1 ft = 30.48 cm",
  },
];

const _form = {
  temp: "",
  bp: "",
  rr: "",
  pr: "",
  hr: "",
  weight: "",
  height: "",
};

// Reusable input with unit suffix
function UnitInput({ label, type = "number", unit, value, onChange, hint }) {
  const cleanValue = value?.replace(` ${unit}`, "") || "";

  return (
    <div style={{ position: "relative" }}>
      <MDBInput
        label={label}
        type={type}
        value={cleanValue}
        onChange={(e) => onChange(e.target.value + " " + unit)}
        hint={hint}
      />
      <span
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "#666",
          pointerEvents: "none",
        }}
      >
        {unit}
      </span>
    </div>
  );
}

export default function Modal() {
  const {
      showModalVs,
      selected = {},
      willCreateVs,
      formSubmitted,
    } = useSelector(({ appointments }) => appointments),
    { token } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    dispatch = useDispatch();

  useEffect(() => {
    setForm(selected || {});
  }, [selected]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { patient, appointment, ...rest } = form;
    dispatch(
      SET_VS({
        data: { patient: patient._id, appointment, vitals: rest },
        token,
      })
    ).then(() => {
      dispatch(TOGGLEVS());
      setForm(_form);
    });
  };

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  const { patient } = selected;
  return (
    <MDBModal
      isOpen={showModalVs}
      toggle={() => dispatch(TOGGLEVS())}
      backdrop
      size="ml"
    >
      <MDBModalHeader
        toggle={() => dispatch(TOGGLEVS())}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="heartbeat" className="mr-2" />
        Vital Signs
        <span
          className="d-block"
          style={{
            fontSize: "0.9rem",
            marginLeft: "2.2rem",
            marginBottom: "-1rem",
            marginTop: "-0.3rem",
          }}
        >
          {fullName(patient?.fullName)}
        </span>
      </MDBModalHeader>

      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            {fields.map(({ key, ...props }) => (
              <MDBCol xl="6" md="6" className="m-0" key={key}>
                <UnitInput
                  {...props}
                  value={form[key] ?? ""}
                  onChange={(v) => handleChange(key, v)}
                />
              </MDBCol>
            ))}
          </MDBRow>

          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={formSubmitted}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreateVs ? "Submit" : "Update"}{" "}
              <Spinner formSubmitted={formSubmitted} />
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
