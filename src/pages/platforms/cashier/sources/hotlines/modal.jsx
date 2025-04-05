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
} from "./../../../../../services/redux/slices/assets/providers";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import { removeUndefinedValues } from "../../../../../services/utilities";

export default function Modal() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { showModal, selected, willCreate, isLoading } = useSelector(
      ({ providers }) => providers
    ),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (showModal) {
      setForm({
        ...selected,
        userId: auth._id,
        clients: activePlatform.branchId,
        category: "hotline",
      });
    }
  }, [showModal, selected, auth, activePlatform]);

  // Handle update function
  const handleUpdate = () => {
    // Check if object has changed
    if (isEqual(form, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    setForm(removeUndefinedValues(form));
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
    willCreate ? handleCreate() : handleUpdate();
  };

  // Handle change sa inputs
  const handleChange = (key, value) =>
    setForm({
      ...form,
      [key]: value,
    });

  return (
    <MDBModal
      isOpen={showModal}
      toggle={() => dispatch(TOGGLE())}
      backdrop
      size="sm"
    >
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE())}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} Hotline
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          {/* Input fields */}
          <MDBInput
            label="Name"
            type="string"
            value={form?.displayname}
            required
            onChange={({ target }) => handleChange("displayname", target.value)}
          />
          <MDBInput
            label="Address"
            type="string"
            value={form?.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
          <MDBInput
            label="Phone Number"
            type="string"
            value={form?.number}
            onChange={(e) => handleChange("number", e.target.value)}
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
