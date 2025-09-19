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
  SAVE,
  TOGGLEVS,
  UPDATE,
} from "../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

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
      isLoading,
    } = useSelector(({ appointments }) => appointments),
    { token } = useSelector(({ auth }) => auth),
    [form, setForm] = useState({}),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    setForm(selected || {});
  }, [selected]);

  console.log("form", form);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (willCreateVs) {
        await dispatch(SAVE({ data: form, token }));
        setForm({});
      } else {
        if (isEqual(form, selected)) {
          return addToast("No changes found, skipping update.", {
            appearance: "info",
          });
        }
        await dispatch(UPDATE({ data: form, token }));
      }
    } catch (err) {
      addToast(err.message || "Failed to save/update.", {
        appearance: "error",
      });
    }
  };

  const handleChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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
        {willCreateVs ? "Create" : "Update"} Vital Signs
      </MDBModalHeader>

      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            {fields.map(({ key, ...props }, i) => (
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
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreateVs ? "Submit" : "Update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
