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
  habits: [], // now array of { name, freq }
  conditions: [], // array of { name, details, date }
  surgeries: [], // array of { name, details, date }
};

export default function Modal() {
  const {
    showModalEhr,
    willCreateEhr,
    selected,
    formSubmitted = false,
  } = useSelector(({ appointments }) => appointments);

  const { token } = useSelector(({ auth }) => auth);
  const [form, setForm] = useState(_form);
  const [step, setStep] = useState(0);
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  console.log("form", form);

  useEffect(() => {
    if (showModalEhr) {
      setForm({
        ..._form,
        ...selected,
        // ensure arrays, even if Mongo returned object
        conditions: Array.isArray(selected?.conditions)
          ? selected.conditions
          : Object.values(selected?.conditions || {}),
        surgeries: Array.isArray(selected?.surgeries)
          ? selected.surgeries
          : Object.values(selected?.surgeries || {}),
        habits: Array.isArray(selected?.habits)
          ? selected.habits
          : Object.values(selected?.habits || {}),
      });
    }
  }, [showModalEhr, selected]);

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

  // Toggle items (conditions, surgeries, habits)
  const handleCheck = (code, label) => {
    setForm((prev) => {
      if (["conditions", "surgeries"].includes(code)) {
        const current = prev[code] || [];
        const exists = current.find((c) => c.name === label);
        return {
          ...prev,
          [code]: exists
            ? current.filter((c) => c.name !== label)
            : [...current, { name: label, details: "", date: "" }],
        };
      }

      if (code === "habits") {
        const current = prev.habits || [];
        const exists = current.find((h) => h.name === label);
        return {
          ...prev,
          habits: exists
            ? current.filter((h) => h.name !== label)
            : [...current, { name: label, freq: "" }],
        };
      }

      return prev;
    });
  };

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`; // YYYY/MM/DD
  };

  // Update text/date for conditions and surgeries
  const handleTextChange = (baseKey, labelOrKey, field, newValue) => {
    setForm((prev) => {
      // case 1: conditions/surgeries (array)
      if (["conditions", "surgeries"].includes(baseKey)) {
        const updated = (prev[baseKey] || []).map((item) => {
          if (item.name !== labelOrKey) return item;
          return {
            ...item,
            details: field === "details" ? newValue : item.details,
            date: field === "date" ? formatDate(newValue) : item.date,
          };
        });
        return { ...prev, [baseKey]: updated };
      }

      // case 2: OB Gyne Hx (object)
      const prevSection = prev[baseKey] || {};
      return {
        ...prev,
        [baseKey]: {
          ...prevSection,
          [labelOrKey]: field === "date" ? formatDate(newValue) : newValue,
        },
      };
    });
  };

  const handleFrequency = (label, value) => {
    setForm((prev) => {
      const updated = (prev.habits || []).map((h) =>
        h.name === label ? { ...h, freq: value } : h
      );
      return { ...prev, habits: updated };
    });
  };

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
      const current = prev[section] || {};
      const gtpalFields = ["gravida", "term", "preterm", "abortion", "living"];

      if (gtpalFields.includes(field)) {
        return {
          ...prev,
          [section]: {
            ...current,
            gtpal: {
              ...(current.gtpal || {}),
              [field]: Number(value),
            },
          },
        };
      }

      return {
        ...prev,
        [section]: {
          ...current,
          [field]: value, // menarche, lmp, contraception
        },
      };
    });
  };

  const handleClose = () => dispatch(TOGGLEEMR());

  const steps = dataEhr.filter(
    (s) => !(s.code === "obGyneHistory" && form.isMale === true)
  );

  const currentStep = steps[step];

  // prevent out-of-range errors
  useEffect(() => {
    if (step >= steps.length) {
      setStep(steps.length - 1); // clamp to last available step
    }
  }, [steps, step, setStep]);

  const { patient } = selected;

  return (
    <MDBModal isOpen={showModalEhr} toggle={handleClose} backdrop size="md">
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
            {currentStep.code === "obGyneHistory" && (
              <ObGyneSection
                step={currentStep}
                form={form}
                handleCheck={handleCheck}
                handleNumber={handleNumber}
                handleTextChange={handleTextChange}
              />
            )}
          </div>

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
                  e.preventDefault();
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
