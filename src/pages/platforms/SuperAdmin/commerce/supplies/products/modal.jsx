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
  UPDATE,
  TOGGLE,
} from "../../../../../../services/redux/slices/market/products";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

export default function Modal() {
  const { showModal, selected, willCreate, isLoading } = useSelector(
      ({ products }) => products
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState({}),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (selected) setForm(selected);
  }, [selected]);

  const handleUpdate = () => {
    TOGGLE();

    // Check if object has changed
    if (isEqual(form, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    dispatch(UPDATE({ data: { ...form, id: selected._id }, token }));
  };

  const handleCreate = () => {
    console.log("saved datass", { data: { ...form, id: selected._id }, token });
    dispatch(SAVE({ data: { ...form, id: selected._id }, token }));
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
        handleClose={() => handleClose()}
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

          {/* ------------------------------Input fields ---------------------------------- */}

          <MDBInput
            label="Name"
            type="text"
            value={handleValue("name")}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
          <MDBInput
            label="Subname"
            type="text"
            value={handleValue("subname")}
            onChange={(e) => handleChange("subname", e.target.value)}
            required
          />

          <label for="sele">Is Consumable</label>
          <select
            id="sele"
            className="form-control mb-3"
            onChange={(e) =>
              handleChange("isConsumable", e.target.value === "true")
            }
            value={handleValue("isConsumable") ? "true" : "false"}
          >
            <option value="true">YES</option>
            <option value="false">NO</option>
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
