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
  MDBModaltable,
} from "mdbreact";
import { TOGGLE } from "../../../../services/redux/slices/reusable/table";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

export default function Modal() {
  const { showModal, selected, willCreate, isLoading } = useSelector(
      ({ table }) => table
    ),
    { auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // Handle update function
  const handleUpdate = () => {
    TOGGLE();

    // Check if object has changed
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

  // Handle create function
  const handleCreate = () => {
    // dispatch(
    //   SAVE({
    //     data: form,
    //     token,
    //   })
    // ).then(() => TOGGLE()); // Close modal after successful save
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) return handleCreate();
    handleUpdate();

    // console.log("form", form);

    // if (willCreate) {
    //   return handleCreate();
    // }

    // handleUpdate();
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
  const handleValue = (key) => form[key] || "";

  // Handle modal close
  const handleClose = () => dispatch(TOGGLE());

  return (
    <MDBModal isOpen={showModal} toggle={TOGGLE} backdrop size="sm">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} Services
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBInput
            label="Name"
            type="text"
            value={handleValue("name")}
            required
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <MDBInput
            label="subname"
            type="text"
            value={handleValue("subname")}
            onChange={(e) => handleChange("subname", e.target.value)}
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
