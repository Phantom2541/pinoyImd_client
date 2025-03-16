import React, { useState, useEffect } from "react";
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
  TOGGLE,
  UPDATE,
} from "../../../../../services/redux/slices/liability/controls";

import { Services } from "../../../../../services/fakeDb";

import { isEqual } from "lodash";

import { useToasts } from "react-toast-notifications";

export default function Modal() {
  const { isLoading, showModal, willCreate, selected } = useSelector(
      ({ controls }) => controls
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState({}),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (willCreate)
      setForm({
        ...selected,
        userId: auth._id,
        branchId: activePlatform.branchId,
      });
    else setForm(selected);
  }, [willCreate, selected, auth._id, activePlatform.branchId]);

  // Handle update function
  const handleUpdate = () => {
    // Check if object has changed
    if (isEqual(form, selected)) {
      addToast("No changes found, skipping update.", {
        appearance: "info",
      });
      dispatch(TOGGLE());
      return;
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
    );
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
    });
    console.log("Form", form);
  };

  return (
    <MDBModal isOpen={showModal} toggle={TOGGLE} backdrop size="sm">
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE())}
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
            label="Low"
            type="number"
            value={form.lo}
            required
            onChange={(e) => handleChange("lo", e.target.value)}
          />

          <MDBInput
            label="Normal"
            type="number"
            value={form.norm}
            required
            onChange={(e) => handleChange("norm", e.target.value)}
          />
          <MDBInput
            label="High"
            type="number"
            value={form.hi}
            required
            onChange={(e) => handleChange("hi", e.target.value)}
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
