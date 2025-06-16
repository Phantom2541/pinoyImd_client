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
  TOGGLE,
  SAVE,
  UPDATE,
} from "../../../../../services/redux/slices/market/machines";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

export default function Modal() {
  const { showModal, selected, willCreate, isLoading } = useSelector(
      ({ machines }) => machines
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (selected) {
      setForm({
        ...selected,
        warranty: selected.warranty || getTodayDate(),
      });
    } else {
      // When creating new entry
      setForm((prev) => ({
        ...prev,
        warranty: getTodayDate(),
      }));
    }
  }, [selected]);
  // Handle update function
  const handleUpdate = () => {
    TOGGLE();

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

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Formats date to "YYYY-MM-DD"
  };
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) return handleCreate();
    handleUpdate();

    // console.log("form", form);

    if (willCreate) {
      return handleCreate();
    }

    handleUpdate();
  };

  // Handle change sa inputs
  const handleChange = (key, value) => {
    if (key.startsWith("pm.")) {
      const pmKey = key.split(".")[1];
      setForm((prev) => ({
        ...prev,
        pm: {
          ...prev.pm,
          [pmKey]: value,
        },
        userId: auth._id,
        branchId: activePlatform.branchId,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [key]: value,
        userId: auth._id,
        branchId: activePlatform.branchId,
      }));
    }
  };

  // Fix: Return correct form value
  const handleValue = (key) => form[key] || "";

  // Handle modal close
  const handleClose = () => dispatch(TOGGLE());

  return (
    <MDBModal
      isOpen={showModal}
      toggle={() => handleClose()}
      backdrop
      size="md"
    >
      <MDBModalHeader
        toggle={() => handleClose()}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} Machines
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                label="Brand"
                type="text"
                value={handleValue("brand")}
                required
                onChange={(e) => handleChange("brand", e.target.value)}
              />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                label="Model"
                type="text"
                value={handleValue("model")}
                onChange={(e) => handleChange("model", e.target.value)}
              />
            </MDBCol>
          </MDBRow>
          <MDBInput
            label="Serial no."
            type="text"
            value={handleValue("serial")}
            onChange={(e) => handleChange("serial", e.target.value)}
          />
          <MDBRow>
            <MDBCol md="6">
              <label className="small ">Accuqired</label>
              <select
                className="form-control form-control-sm"
                value={handleValue("accuqired") || ""}
                onChange={(e) => handleChange("accuqired", e.target.value)}
              >
                <option disabled value="">
                  Options
                </option>
                <option value="brand-new">Brand-new</option>
                <option value="refurbish">Refurbish</option>
              </select>
            </MDBCol>
            <MDBCol md="6">
              <label className="small ">Status</label>
              <select
                className="form-control form-control-sm"
                value={handleValue("status") || ""}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option disabled value="">
                  Options
                </option>
                <option value="fully functional">Fully Functional</option>
                <option value="functional">Functional</option>
                <option value="damaged">Damaged</option>
                <option value="broken">Broken</option>
              </select>
            </MDBCol>
          </MDBRow>

          <MDBInput
            label="Price"
            type="number"
            value={handleValue("price")}
            onChange={(e) => handleChange("price", e.target.value)}
          />

          <MDBInput
            label="Warranty"
            type="number"
            value={handleValue("warranty")}
            onChange={(e) => handleChange("warranty", e.target.value)}
          />
          <MDBRow className="d-flex align-items-center">
            <MDBCol md="5">
              <MDBInput
                className="text-right"
                label="Preventive Maintenance"
                type="number"
                value={handleValue("pm")?.value || ""}
                onChange={(e) => handleChange("pm.value", e.target.value)}
              />
            </MDBCol>
            <MDBCol md="7">
              <select
                className="form-control form-control-sm ml-2"
                value={handleValue("pm")?.unit || ""}
                onChange={(e) => handleChange("pm.unit", e.target.value)}
              >
                <option value="">Select Schedule</option>
                <option value="day">Days</option>
                <option value="month">Months</option>
                <option value="year">Years</option>
              </select>
            </MDBCol>
          </MDBRow>
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
