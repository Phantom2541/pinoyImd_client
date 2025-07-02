import React, { useState, useEffect } from "react";
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
} from "./../../../../services/redux/slices/market/attendances";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

export default function Modal() {
  const { showModal, selected, willCreate, isLoading } = useSelector(
      ({ attendances }) => attendances
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (selected) setForm(selected);
  }, [selected]);

  const handleUpdate = () => {
    if (isEqual(form, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    dispatch(UPDATE({ data: { ...form, _id: selected._id }, token }));
  };

  const handleCreate = () => {
    dispatch(SAVE({ data: { ...form, _id: selected._id }, token }));
    console.log("saved datass", { data: { ...form, id: selected._id }, token });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) {
      return handleCreate();
    }

    handleUpdate();
  };

  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
      userId: auth._id,
      branchId: activePlatform.branchId,
    });
  };

  const handleValue = (key) => form[key] || "";

  const handleClose = () => dispatch(TOGGLE());

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
        {willCreate ? "Create" : "Update"} Record
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          {/* ------------------------------Preset input fields ---------------------------------- */}

          <MDBInput
            label="In"
            type="time"
            value={handleValue("in")}
            required
            onChange={(e) => handleChange("in", e.target.value)}
          />
          <MDBInput
            label="Out"
            type="time"
            value={handleValue("out")}
            required
            onChange={(e) => handleChange("out", e.target.value)}
          />

          <label htmlFor="status">Status</label>
          <select
            id="status"
            className="form-control mb-3"
            value={handleValue("status")}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="">Select Status</option>
            <option value="late">late</option>
            <option value="early">early</option>
            <option value="on time">on time</option>
          </select>

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
