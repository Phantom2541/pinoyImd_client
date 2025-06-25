import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
} from "mdbreact";
import {
  SAVE,
  TOGGLE,
  UPDATE,
} from "../../../../../services/redux/slices/market/generics";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

export default function Modal() {
  const { showModal, selected, willCreate, isLoading } = useSelector(
      ({ generics }) => generics
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (selected) {
      setForm(selected);
    }
  }, [selected]);
  // Handle update function
  const handleUpdate = () => {
    dispatch(TOGGLE());

    // Check if object has changed
    if (isEqual(form, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    dispatch(
      UPDATE({
        data: { ...form, _id: selected._id },
        token,
      })
    );
  };

  // Handle create function
  const handleCreate = () => {
    dispatch(
      SAVE({
        data: form,
        token,
      })
    ).then(() => TOGGLE()); // Close modal after successful save
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) return handleCreate();
    handleUpdate();

    if (willCreate) {
      return handleCreate();
    }

    handleUpdate();
  };

  // Handle change sa inputs
  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
      userId: auth._id,
      branchId: activePlatform.branchId,
    });
  };

  // Fix: Return correct form value
  const handleValue = (key) => form[key] ?? "";

  // Handle modal close
  const handleClose = () => dispatch(TOGGLE());

  return (
    <MDBModal isOpen={showModal} toggle={handleClose} backdrop size="md">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} Generics
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          {/* Input fields */}
          <MDBInput
            label="Name"
            type="text"
            value={handleValue("name")}
            required
            onChange={(e) => {
              console.log("e.target.value", e.target.value);
              handleChange("name", e.target.value);
            }}
          />
          <label className="small">Drug Class</label>
          <select
            className="form-control form-control"
            value={handleValue("drugClass") || ""}
            onChange={(e) => handleChange("drugClass", e.target.value)}
          >
            <option disabled value="">
              Options
            </option>
            <option value="analgesics">Analgesics</option>
            <option value="antipyretics">Antipyretics</option>
            <option value="antibiotics">Antibiotics</option>
            <option value="antihistamines">Antihistamines</option>
            <option value="antihypertensives">Antihypertensives</option>
            <option value="antidiabetics">Antidiabetics</option>
            <option value="antacids / ppis" title="Proton pump inhibitors">
              Antacids / PPIs
            </option>
            <option value="antidepressants">Antidepressants</option>
            <option value="antipsychotics">Antipsychotics</option>
            <option value="antivirals">Antivirals</option>
            <option value="antifungals">Antifungals</option>
            <option value="bronchodilators">Bronchodilators</option>
            <option value="diuretics">Diuretics</option>
            <option value="laxatives">Laxatives</option>
            <option value="anticoagulants">Anticoagulants</option>
            <option value="antiemetics">Antiemetics</option>
            <option value="sedatives / hypnotics">Sedatives / Hypnotics</option>
            <option value="antiepileptics">Antiepileptics</option>
            <option
              value="nsaids"
              title="Non-steroidal anti-inflammatory drugs"
            >
              NSAIDs
            </option>
            <option value="contraceptives">Contraceptives</option>
          </select>

          <label className="small">System Target</label>
          <select
            className="form-control form-control"
            value={handleValue("SystemTarget") || ""}
            onChange={(e) => handleChange("SystemTarget", e.target.value)}
          >
            <option disabled value="">
              Options
            </option>
            <option value="nervous">Nervous</option>
            <option value="cardiovascular">Cardiovascular</option>
            <option value="respiratory">Respiratory</option>
            <option value="circulatory">Circulatory</option>
            <option value="digestive">Digestive</option>
            <option value="endocrine">Endocrine</option>
            <option value="renal/urinary">Renal/Urinary</option>
            <option value="musculoskeletal">Musculoskeletal</option>
            <option value="immune">Immune</option>
            <option value="reproductive">Reproductive</option>
            <option value="integumentary (skin)">Integumentary (Skin)</option>
            <option value="systemic">Systemic</option>
            <option value="sensory (eyes/ears)">Sensory (Eyes/Ears)</option>
            <option value="hematologic">Hematologic</option>
            <option value="metabolic">Metabolic</option>
            <option value="psychiatric">Psychiatric</option>
          </select>

          <label>Status</label>
          <select
            className="form-control form-control"
            value={handleValue("status") || ""}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option disabled value="">
              Options
            </option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="halt">Halt</option>
            <option value="banned">Banned</option>
          </select>
          {/* Submit button */}
          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "Submit" : "Update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
