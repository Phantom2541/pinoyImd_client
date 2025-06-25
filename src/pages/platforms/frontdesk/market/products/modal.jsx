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
  TOGGLE,
} from "../../../../../services/redux/slices/market/products";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

const Modal = () => {
  const { showModal, toggle, selected, willCreate, isLoading } = useSelector(
      ({ products }) => products
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();
  useEffect(() => {
    if (selected) setForm(selected);
  }, [selected]);
  // Handle update function
  const handleUpdate = () => {
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
    TOGGLE();
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
  const handleValue = (key) => form[key] || "";

  // Handle modal close
  const handleClose = () => TOGGLE();

  return (
    <MDBModal
      isOpen={showModal}
      toggle={() => handleClose()}
      backdrop
      size="sm"
    >
      <MDBModalHeader
        toggle={() => handleClose()}
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
          ></MDBTypography>

          {/* Input fields */}
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
            required
            onChange={(e) => handleChange("subname", e.target.value)}
          />
          <MDBInput
            label="barcode"
            type="text"
            value={handleValue("barcode")}
            required
            onChange={(e) => handleChange("barcode", e.target.value)}
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
};

export default Modal;
