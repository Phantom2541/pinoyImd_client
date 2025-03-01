import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBTypography,
} from "mdbreact";
import {
  SAVE,
  UPDATE,
} from "../../../../../../services/redux/slices/liability/assurances";

import { Services } from "../../../../../../services/fakeDb";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

export default function Modal() {
  const { show, toggle, selected, willCreate, isLoading } = useSelector(
      ({ assurances }) => assurances
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // Set form data kapag nagbukas ng modal
  // useEffect(() => {
  //   setForm(selected);
  // }, [selected]);

  // Handle update function
  const handleUpdate = () => {
    toggle();

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
    ).then(() => toggle()); // Close modal after successful save
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) {
      return handleCreate();
    }

    handleUpdate();
  };

  // Handle change sa inputs
  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: Number(value),
      userId: auth._id,
      branchId: activePlatform.branchId,
    });
  };

  // Fix: Return correct form value
  const handleValue = (key) => form[key] || "";

  // Handle modal close
  const handleClose = () => toggle();

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="sm">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} Controls
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBTypography
            tag="h4"
            variant="h4-responsive"
            className="text-center"
          >
            {Services.getName(selected?.serviceId)}
          </MDBTypography>

          {/* Input fields */}
          <MDBInput
            label="Abnormal"
            type="number"
            value={handleValue("abnormal")}
            required
            onChange={(e) => handleChange("abnormal", e.target.value)}
          />
          <MDBInput
            label="High"
            type="number"
            value={handleValue("high")}
            required
            onChange={(e) => handleChange("high", e.target.value)}
          />
          <MDBInput
            label="Normal"
            type="number"
            value={handleValue("normal")}
            required
            onChange={(e) => handleChange("normal", e.target.value)}
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
