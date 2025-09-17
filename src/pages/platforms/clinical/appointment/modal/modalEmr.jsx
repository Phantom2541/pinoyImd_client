import React, { useState } from "react";
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
  SAVE,
  TOGGLEEMR,
} from "../../../../../services/redux/slices/diagnostics/clinic/appointments";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import dataEhr from "./dataEhr.json";
import { FamilyRootSystem, ChecklistSection, ObGyneSection } from "./form";
import "./style.css";

export default function Modal() {
  const { showModalEmr, willCreateEhr, selected, isLoading } = useSelector(
      ({ appointments }) => appointments
    ),
    { token } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected || {}),
    [step, setStep] = useState(0),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  console.log("selected", selected);

  const steps = dataEhr;
  console.log("form", form);

  const handleUpdate = () => {
    dispatch(TOGGLEEMR());

    if (isEqual(form, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    // dispatch(
    //   UPDATE({
    //     data: { ...form, _id: selected._id },
    //     token,
    //   })
    // );
  };

  const handleCreate = () => {
    dispatch(
      SAVE({
        data: form,
        token,
      })
    ).then(() => dispatch(TOGGLEEMR()));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (willCreateEhr) return handleCreate();
    handleUpdate();
  };

  const handleCheck = (code, label, checked) => {
    setForm((prev) => {
      // OB Gyne Hx = single select
      if (code === "OB Gyne Hx") {
        return {
          ...prev,
          [code]: {
            ...(prev[code] || {}),
            selected: checked ? label : "",
          },
        };
      }

      // Other sections = multi select
      const current = prev[code] || [];
      return {
        ...prev,
        [code]: checked
          ? [...current, label] // add
          : current.filter((x) => x !== label), // remove
      };
    });
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

  const currentStep = steps[step];

  return (
    <MDBModal isOpen={showModalEmr} toggle={handleClose} backdrop size="ml">
      <MDBModalHeader
        toggle={handleClose}
        className="appEhr light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="appEhr mr-2" />
        {willCreateEhr ? "Create" : "Update"} eMR
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
                handleCheck={handleCheck}
              />
            )}
            {["PMHx", "PSHx"].includes(currentStep.code) && (
              <ChecklistSection
                step={currentStep}
                form={form}
                handleCheck={handleCheck}
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
          <div className="appEhr flex justify-between">
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
              <MDBBtn type="submit" disabled={isLoading} color="info">
                {willCreateEhr ? "Submit" : "Update"}
              </MDBBtn>
            )}
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
