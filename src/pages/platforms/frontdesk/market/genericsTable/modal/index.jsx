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
  TOGGLE,
  SAVE,
  UPDATE,
} from "../../../../../../services/redux/slices/market/generics";

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

  // Sync form state with selected when modal opens
  useEffect(() => {
    if (selected) {
      setForm(selected);
    }
  }, [selected]);
  // Handle updating an existing product
  const handleUpdate = () => {
    dispatch(TOGGLE());

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

  // Handle creating a new product
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

  // Handle input change
  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
      userId: auth._id,
      branchId: activePlatform.branchId,
    });
  };

  // Retrieve value for inputs
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
          <MDBInput
            label="GenericName"
            type="text"
            value={handleValue("name")}
            required
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <label className="small">Dosage Form</label>
          <select
            className="form-control form-control"
            value={handleValue("dosageForm") || ""}
            onChange={(e) => handleChange("dosageForm", e.target.value)}
          >
            <option disabled value="">
              Option
            </option>
            <option value="tablet">Tablet</option>
            <option value="capsule">Capsule</option>
            <option value="syrup">Syrup</option>
            <option value="suspension">Suspension</option>
            <option value="injection">Injection</option>
            <option value="cream">Cream</option>
            <option value="ointment">Ointment</option>
            <option value="inhaler">Inhaler</option>
            <option value="supporitory">Supporitory</option>
            <option value="patch">Patch</option>
            <option value="drops">Drops</option>
            <option value="lozenge">Lozenge</option>
          </select>

          <MDBInput
            label="Strength"
            type="text"
            value={handleValue("strength")}
            required
            onChange={(e) => handleChange("strength", e.target.value)}
          />

          <label className="small">Route</label>
          <select
            className="form-control form-control"
            value={handleValue("route") || ""}
            onChange={(e) => handleChange("route", e.target.value)}
          >
            <option disabled value="">
              Option
            </option>
            <option value="oral">Oral</option>
            <option value="inhalation">Inhalation</option>
            <option value="intravenous">Intravenous</option>
            <option value="intramuscular">Intramuscular</option>
            <option value="subcutaneous">Subcutaneous</option>
            <option value="topical">Topical</option>
            <option value="sublingual">Sublingual</option>
            <option value="buccal">Buccal</option>
            <option value="rectal">Rectal</option>
            <option value="transdermal">Transdermal</option>
          </select>

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

          <label className="small">Status</label>
          <select
            className="form-control form-control"
            value={handleValue("status") || ""}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option disabled value="">
              Option
            </option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
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
