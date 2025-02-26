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
} from "../../../../../../services/redux/slices/responsibilities/controls";

import { Services } from "./../../../../../../services/fakeDb";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

// Declare initial form state
const _form = {
  serviceId: "",
  abnormal: "",
  high: "",
  normal: "",
};

export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading } = useSelector(({ controls }) => controls),
    { token, auth } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // Set form data kapag nagbukas ng modal
  useEffect(() => {
    if (!willCreate && show && selected) {
      setForm(selected);
    } else {
      setForm(_form);
    }
  }, [willCreate, selected, show]);

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

    setForm(_form);
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
      [key]: value,
      userId: auth._id,
      branchId: "637097f0535529a3a57e933e",
    });
  };

  // Fix: Return correct form value
  const handleValue = (key) => form[key] || "";

  // Handle modal close
  const handleClose = () => {
    setForm(_form);
    toggle();
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="sm">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected?.serviceId || "Controls"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          {/* Select dropdown */}
          <select
            name="serviceId"
            onChange={(e) => handleChange("serviceId", e.target.value)}
            className="w-100"
            value={handleValue("serviceId")}
          >
            <option value="">Select Service</option>
            {Services.collections.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>

          {/* Input fields */}
          <MDBInput
            label="Abnormal"
            type="text"
            value={handleValue("abnormal")}
            required
            onChange={(e) => handleChange("abnormal", e.target.value)}
          />
          <MDBInput
            label="High"
            type="text"
            value={handleValue("high")}
            required
            onChange={(e) => handleChange("high", e.target.value)}
          />
          <MDBInput
            label="Normal"
            type="text"
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
