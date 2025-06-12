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
  UPDATE,
  TOGGLE,
} from "../../../../../services/redux/slices/market/productsGenerics";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

export default function Modal() {
  const { showModal, selected, willCreate, isLoading } = useSelector(
      ({ productsGenerics }) => productsGenerics
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected || {}),
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
    ).then(() => dispatch(TOGGLE())); // Close modal after save
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

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
    <MDBModal isOpen={showModal} toggle={handleClose} backdrop size="sm">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} Product
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
            label="Subname"
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
