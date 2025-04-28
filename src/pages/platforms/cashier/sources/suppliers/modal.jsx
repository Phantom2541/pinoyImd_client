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
} from "../../../../../services/redux/slices/assets/providers";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

export default function Modal() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { showModal, selected, willCreate, isLoading } = useSelector(
      ({ providers }) => providers
    ),
    { collections } = useSelector(({ branches }) => branches),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  //Listener
  useEffect(() => {
    if (showModal) {
      setForm({
        ...selected,
        userId: auth._id,
        clients: activePlatform.branchId,
        category: "supplier",
      });
    }
  }, [showModal, selected, auth, activePlatform]);
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
    //console.log("Add Button : ", form);
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    willCreate ? handleCreate() : handleUpdate();
  };

  // Handle change sa inputs
  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });

    console.log("Form", form);
  };

  return (
    <MDBModal
      isOpen={showModal}
      TOGGLE={TOGGLE}
      backdrop
      size="sm"
      disableFocusTrap={false}
    >
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE())}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} Supplier
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBTypography
            tag="h4"
            variant="h4-responsive"
            className="text-center"
          ></MDBTypography>
          <select
            onChange={(e) => handleChange("vendors", e.target.value)}
            className="form-control"
          >
            <option value="" disabled>
              Select a branch
            </option>
            {Array.isArray(collections) &&
              collections.map((branch, index) => (
                <option key={index} value={branch._id}>
                  {branch.displayname || (branch.name && branch.subname)}
                </option>
              ))}
          </select>

          {/* Input fields */}
          <MDBInput
            label="Name"
            type="string"
            value={form?.displayname}
            required
            onChange={(e) => handleChange("displayname", e.target.value)}
          />

          <MDBInput
            label="Number"
            type="string"
            value={form?.number}
            onChange={(e) => handleChange("number", e.target.value)}
          />
          <MDBInput
            label="address"
            type="string"
            value={form?.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />

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
