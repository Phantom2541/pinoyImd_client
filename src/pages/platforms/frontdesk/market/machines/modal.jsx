import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBTypography,
  MDBModaltable,
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
        waranty: selected.waranty || getTodayDate(),
      });
    } else {
      // When creating new entry
      setForm((prev) => ({
        ...prev,
        waranty: getTodayDate(),
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
    console.log("key :", key);
    console.log("value :", value);
    console.log("form :", form);
    setForm({
      ...form,
      [key]: value,
      userId: auth._id,
      branchId: activePlatform.branchId,
    });
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
          <MDBInput
            label="Brand"
            type="text"
            value={handleValue("brand")}
            required
            onChange={(e) => handleChange("brand", e.target.value)}
          />
          <MDBInput
            label="Model"
            type="text"
            value={handleValue("model")}
            onChange={(e) => handleChange("model", e.target.value)}
          />
          <MDBInput
            label="Serial no."
            type="text"
            value={handleValue("serial")}
            onChange={(e) => handleChange("serial", e.target.value)}
          />
          <MDBInput
            label="Accuqired"
            type="text"
            value={handleValue("accuqired")}
            onChange={(e) => handleChange("accuqired", e.target.value)}
          />
          <MDBInput
            label="Status"
            type="text"
            value={handleValue("status")}
            onChange={(e) => handleChange("status", e.target.value)}
          />
          <MDBInput
            label="Price"
            type="number"
            value={handleValue("price")}
            onChange={(e) => handleChange("price", e.target.value)}
          />

          <MDBInput
            label="Warranty"
            type="date"
            value={handleValue("warranty")}
            onChange={(e) => handleChange("warranty", e.target.value)}
          />
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
