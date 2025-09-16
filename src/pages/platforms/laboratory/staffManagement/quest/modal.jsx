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
} from "../../../../../services/redux/slices/diagnostics/clinic/quest";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

export default function Modal() {
  const { showModal, selected, willCreate, isLoading } = useSelector(
    ({ quest }) => quest
  );
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth);
  const [form, setForm] = useState(selected || { status: "draft" });
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  // Auto update form when selected changes
  useEffect(() => {
    setForm(selected || { status: "draft" });
  }, [selected]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) {
      dispatch(
        SAVE({
          data: form,
          token,
        })
      ).then(() => dispatch(TOGGLE()));
    } else {
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
      dispatch(TOGGLE());
    }
  };

  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
      userId: auth._id,
      branchId: activePlatform.branchId,
    });
  };

  const handleValue = (key) => form?.[key] || "";

  const handleClose = () => dispatch(TOGGLE());

  return (
    <MDBModal isOpen={showModal} toggle={handleClose} backdrop size="sm">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} schedule
      </MDBModalHeader>
      <MDBModalBody>
        <form onSubmit={handleSubmit}>
          <MDBInput
            label="Company"
            type="text"
            value={handleValue("company")}
            required
            onChange={(e) => handleChange("company", e.target.value)}
          />
          <MDBInput
            label="Location"
            type="text"
            value={handleValue("location")}
            required
            onChange={(e) => handleChange("location", e.target.value)}
          />
          <MDBInput
            type="datetime-local"
            value={handleValue("schedule")}
            required
            onChange={(e) => handleChange("schedule", e.target.value)}
          />

          {/* Status dropdown, lalabas lang sa UPDATE */}
          {!willCreate && (
            <>
              <label>Status</label>
              <select
                className="form-control"
                value={handleValue("status") || ""}
                onChange={(e) => handleChange("status", e.target.value)}
              >
                <option disable value="">
                  Options
                </option>
                <option value="posted">Posted</option>
                <option value="pending">Pending For Approval</option>
                <option value="reschedule">Reschedule</option>
              </select>
            </>
          )}

          <div className="text-center">
            <MDBBtn type="submit" disabled={isLoading} color="info" rounded>
              {willCreate ? "Submit" : "Update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
