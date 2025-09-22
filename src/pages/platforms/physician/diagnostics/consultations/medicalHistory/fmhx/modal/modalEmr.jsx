import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBTypography,
} from "mdbreact";
import {
  SET_EMR,
  TOGGLEEMR,
} from "../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import dataEhr from "./dataEhr.json";
import { FamilyRootSystem, ChecklistSection, ObGyneSection } from "./form";
import "./style.css";
import Spinner from "../../../../../components/spinner";
import { fullName } from "../../../../../services/utilities";
const _form = {
  familyHistory: {
    Mother: [],
    Father: [],
  },
  habits: {},
  conditions: {},
  surgeries: {},
};
export default function Modal() {
  const {
      showModalEhr,
      willCreateEhr,
      selected,
      formSubmitted = false,
    } = useSelector(({ appointments }) => appointments),
    { token } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    [step, setStep] = useState(0),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (showModalEhr) {
      // Merge selected with default _form to ensure surgeries exists
      setForm({
        ..._form,
        ...selected,
        surgeries: selected?.surgeries || {}, // ensure surgeries key exists
      });
    }
  }, [showModalEhr, selected]);

  console.log("form", form);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEqual(form, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    dispatch(
      SET_EMR({
        data: { ...form, patient: selected?.patient?._id },
        token,
      })
    ).then(() => {
      dispatch(TOGGLEEMR());
      setForm(_form);
      setStep(0);
    });
  };

  const handleCheck = (code, label) => {
    setForm((prev) => {
      const current = prev[code] || {};
      const newCurrent = { ...current };

      if (newCurrent.hasOwnProperty(label)) {
        delete newCurrent[label];
      } else {
        newCurrent[label] = "";
      }

      return {
        ...prev,
        [code]: newCurrent,
      };
    });
  };

  // For PMHx textbox values
  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`; // YYYY/MM/DD
  };

  const handleTextChange = (baseKey, label, field, newValue) => {
    setForm((prev) => {
      const prevVal = prev[baseKey]?.[label] || "";
      const [prevDetails = "", prevDate = ""] = prevVal.split("-");

      const details = field === "details" ? newValue : prevDetails;
      const date = field === "date" ? formatDate(newValue) : prevDate;

      let combined = details;
      if (date) combined = `${details}-${date}`;

      return {
        ...prev,
        [baseKey]: {
          ...prev[baseKey],
          [label]: combined,
        },
      };
    });
  };

  // For socialHistory frequency selection
  function handleFrequency(code, label, value) {
    const _form = { ...form };
    const current = _form[code] ? { ..._form[code] } : {};
    current[label] = value;
    setForm({ ..._form, [code]: current });
  }

  const handleSelectRoot = (key, value, isChecked) => {
    const roots = [...(form?.familyHistory[key] || [])];
    if (isChecked) {
      roots.push(value);
    } else {
      roots.splice(roots.indexOf(value), 1);
    }
    setForm((prev) => ({
      ...prev,
      familyHistory: {
        ...prev.familyHistory,
        [key]: roots,
      },
    }));
  };

  const handleNumber = (section, field, value) => {
    setForm((prev) => {
      const current = prev[section] || { selected: [] };
      return {
        ...prev,
        [section]: {
          ...current,
          [field]: Number(value),
        },
      };
    });
  };

  const handleClose = () => dispatch(TOGGLEEMR());

  const steps = dataEhr;
  const currentStep = steps[step];
  const { patient } = selected;

  return (
    <MDBModal isOpen={showModalEhr} toggle={handleClose} backdrop size="ml">
      <MDBModalHeader
        toggle={handleClose}
        className="appEhr light-blue darken-3 white-text"
      >
        <MDBIcon icon="clipboard-check" className="appEhr mr-2" />
        eMR
        <span
          className="d-block"
          style={{
            fontSize: "0.9rem",
            marginLeft: "1.7rem",
            marginBottom: "-1rem",
            marginTop: "-0.3rem",
          }}
        >
          {fullName(patient?.fullName)}
        </span>
      </MDBModalHeader>

      <MDBModalBody className="appEhr mb-0">
        <form onSubmit={handleSubmit}>
          <MDBTypography tag="h5" className="appEhr center mb-3">
            Step {step + 1} of {steps.length}: {currentStep.title}
          </MDBTypography>

          <div className="mb-3 ">
            {currentStep.code === "FMHx" && (
              <FamilyRootSystem
                step={currentStep}
                form={form}
                handleCheck={handleSelectRoot}
              />
            )}
            {["PMHx", "PSHx", "socialHistory"].includes(currentStep.code) && (
              <ChecklistSection
                step={currentStep}
                form={form}
                handleCheck={handleCheck}
                handleTextChange={handleTextChange}
                handleFrequency={handleFrequency}
              />
            )}
            {currentStep.code === "OB Gyne Hx" && (
              <ObGyneSection
                step={currentStep}
                form={form}
                handleCheck={handleCheck}
                handleNumber={handleNumber}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="d-flex justify-content-center">
            <MDBBtn
              type="button"
              disabled={step === 0}
              color="secondary"
              onClick={() => setStep(step - 1)}
            >
              Back
            </MDBBtn>

            {step < steps.length - 1 ? (
              <MDBBtn
                type="button"
                color="info"
                onClick={(e) => {
                  e.preventDefault(); // stop accidental submit
                  setStep(step + 1);
                }}
              >
                Next
              </MDBBtn>
            ) : (
              <MDBBtn type="submit" disabled={formSubmitted} color="info">
                {willCreateEhr ? "Submit" : "Update"}{" "}
                <Spinner formSubmitted={formSubmitted} />
              </MDBBtn>
            )}
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
