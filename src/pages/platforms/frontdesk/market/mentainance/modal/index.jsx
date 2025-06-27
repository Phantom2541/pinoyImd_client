import { useEffect, useState } from "react";
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
  TOGGLE,
  SAVE,
  UPDATE,
} from "../../../../../../services/redux/slices/market/mentainance";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

export default function Modal() {
  const { showModal, selected, willCreate, isLoading } = useSelector(
      ({ mentainance }) => mentainance
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { collections } = useSelector(({ machines }) => machines),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();
  useEffect(() => {
  if (selected) {
    setForm(selected);
  } else if (willCreate) {
    setForm({
      machineId: "",
      engineer: "",
      purpose: "Routine maintenance",
      recommendations: "No issues found",
    });
  }

    
  }, [selected, willCreate]);


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
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) return handleCreate();
    handleUpdate();

    console.log("form", form);

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
          <small>Machine</small>
          <select
            name="machineId"
            className="form-control"
            id=""
            value={handleValue("machineId")}
            onChange={(e) => handleChange("machineId", e.target.value)}
          >
            <option value=""></option>
            {collections.map((collection) => (
              <option key={collection._id} value={collection._id}>
                {collection.brand}
                {collection.model}
              </option>
            ))}
          </select>

          <MDBInput
            label="Engineer"
            type="text"
            value={handleValue("engineer")}
            onChange={(e) => handleChange("engineer", e.target.value)}
          />
          <MDBInput
            label="Purpose"
            type="text"
            value={handleValue("purpose")}
            onChange={(e) => handleChange("purpose", e.target.value)}
          />
          <MDBInput
            label="Recommendations / Next Steps"
            type="text"
            value={handleValue("recommendations")}
            required
            onChange={(e) => handleChange("recommendations", e.target.value)}
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
