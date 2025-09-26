// StepModal.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";
import {
  SET_EMR,
  TOGGLEMINIEMR,
} from "../../../../../../services/redux/slices/diagnostics/clinic/appointments";
import Spinner from "../../../../../../components/spinner";
import {
  FamilyRootSystem,
  ChecklistSection,
  ObGyneSection,
} from "../../../../../platforms/clinical/appointment/modal/form";

export default function StepModal() {
  const dispatch = useDispatch();
  const { addToast } = useToasts();
  const { token } = useSelector(({ auth }) => auth);
  const { selected, showModalMiniEhr, loading, patientId } = useSelector(
    ({ appointments }) => appointments
  );

  const toggle = () => dispatch(TOGGLEMINIEMR());

  // Use local form state instead of directly mutating selected
  const [form, setForm] = useState({});
  const stepType = Object.keys(selected || {})[0] || "";

  console.log("form", form);

  useEffect(() => {
    if (showModalMiniEhr) setForm(selected || {});
  }, [showModalMiniEhr, selected]);

  /** ---------- Handlers ---------- */
  const handleCheck = (section, label, value) => {
    setForm((prev) => {
      const updated = { ...prev };

      if (section === "Mother" || section === "Father") {
        const arr = updated.FMHx?.[section] || [];
        updated.FMHx = {
          ...updated.FMHx,
          [section]: value ? [...arr, label] : arr.filter((i) => i !== label),
        };
      } else {
        const current = updated[section] || [];
        updated[section] = value
          ? [...current, label]
          : current.filter((i) => i !== label);
      }

      return updated;
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

  const handleTextChange = (section, key, field, value) => {
    setForm((prev) => {
      const updated = { ...prev };
      if (!updated[section]) updated[section] = {};
      if (field === "text") updated[section][key] = value;
      else if (field === "date") updated[section][key] = value;
      return updated;
    });
  };

  const handleNumber = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: Number(value),
      },
    }));
  };

  /** ---------- Submit ---------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      SET_EMR({
        data: { ...form, patient: patientId },
        token,
      })
    )
      .then(() => {
        addToast("Data updated successfully", { appearance: "success" });
        toggle();
      })
      .catch(() => addToast("Failed to update data", { appearance: "error" }));
  };

  /** ---------- Render Section ---------- */
  const renderSection = () => {
    if (stepType === "familyHistory" && form.familyHistory) {
      return (
        <FamilyRootSystem
          step={{ items: form.familyHistory }} // pass diseases object
          form={form}
          handleCheck={handleSelectRoot}
        />
      );
    }

    if (stepType === "PMHx" && form.PMHx) {
      return (
        <ChecklistSection
          step={{ code: "PMHx" }}
          form={form}
          handleCheck={handleCheck}
          handleTextChange={handleTextChange}
        />
      );
    }

    if (stepType === "surgeries" && form.surgeries) {
      return (
        <ChecklistSection
          step={{ code: "PSHx" }}
          form={form}
          handleCheck={handleCheck}
          handleTextChange={handleTextChange}
        />
      );
    }

    if (stepType === "Habits" && form.Habits) {
      return (
        <ChecklistSection
          step={{ code: "socialHistory" }}
          form={form}
          handleCheck={handleCheck}
          handleTextChange={handleTextChange}
        />
      );
    }

    if (stepType === "OBGyne" && form.obGyneHistory) {
      return (
        <ObGyneSection
          step={{
            code: "obGyneHistory",
            items: form.obGyneHistory?.items || [],
          }}
          form={form}
          handleTextChange={handleTextChange}
          handleNumber={handleNumber}
        />
      );
    }

    return <div>No data available</div>;
  };

  return (
    <MDBModal isOpen={showModalMiniEhr} toggle={toggle} backdrop size="md">
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="file-medical-alt" className="mr-2" />
        {stepType}
      </MDBModalHeader>
      <MDBModalBody>
        <form onSubmit={handleSubmit}>
          {renderSection()}
          <div className="d-flex justify-content-center mt-3">
            <MDBBtn type="submit" color="info" disabled={loading}>
              Save <Spinner formSubmitted={loading} />
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
