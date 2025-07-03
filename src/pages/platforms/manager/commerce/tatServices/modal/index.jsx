import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
} from "mdbreact";
import {
  TOGGLE,
  UPDATE_TAT,
} from "../../../../../../services/redux/slices/assets/branches";
import { Templates } from "../../../../../../services/fakeDb";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import { SetActivePlatform } from "../../../../../../services/redux/slices/assets/persons/auth";

export default function Modal() {
  const {
      showModal,
      selected,
      willCreate,
      isLoading,
      department,
      collections,
    } = useSelector(({ branches }) => branches),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
    [existingSection, setExistingSection] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    // Extract only the used sections (by name, case-insensitive)
    const used = collections.map((item) =>
      (item.section || "").toLowerCase().trim()
    );
    setExistingSection(used); // Now it's an array of strings
  }, [collections, showModal]);

  const { branch } = activePlatform;

  useEffect(() => {
    if (selected) setForm(selected);
  }, [selected]);

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
      UPDATE_TAT({
        data: { ...form, _id: selected._id },
        token,
      })
    );
  };

  // Handle create function
  const handleCreate = () => {
    const { tat = [] } = branch;
    const _tat = [...tat];
    _tat.unshift(form);
    dispatch(
      UPDATE_TAT({
        data: { _id: branch._id, tat: _tat },
        token,
      })
    ).then(() => {
      dispatch(SetActivePlatform({ data: _tat }));
      dispatch(TOGGLE());
    }); // Close modal after successful save
  };
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const finalForm = {
      ...form,
      department,
    };

    if (willCreate) return handleCreate(finalForm);
    handleUpdate(finalForm);
  };

  // Handle change sa inputs
  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
    console.log("form", form);
  };

  // Fix: Return correct form value
  const handleValue = (key) => form[key] || "";

  // Handle modal close
  const handleClose = () => dispatch(TOGGLE());

  console.log(
    "selecte sections"
    // [...filtered].map(({ section }) => section)
  );
  return (
    <MDBModal isOpen={showModal} toggle={handleClose} backdrop size="sm">
      <MDBModalHeader
        toggle={() => handleClose()}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} TAT Services
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <h5>
            Department: {department === "LAB" ? "Laboratory" : "Radiology"}
          </h5>
          <select
            className="form-control form-control-sm"
            value={handleValue("section")}
            required
            onChange={(e) => handleChange("section", e.target.value)}
          >
            <option value="" disabled>
              Select Section
            </option>
            {Templates.getComponents(department)
              .filter(
                (sec) =>
                  !existingSection.includes((sec || "").toLowerCase().trim())
              )
              .map((component) => (
                <option key={component} value={component}>
                  {component}
                </option>
              ))}
          </select>
          <label>Mode</label>
          <select
            className="form-control form-control-sm"
            value={handleValue("mode")}
            required
            onChange={(e) => handleChange("mode", e.target.value)}
          >
            <option value="">Select</option>
            <option value="default">Default</option>
            <option value="custom">Custom</option>
          </select>
          {form.mode === "custom" && (
            <div className="mb-3">
              <label htmlFor="customMode" className="form-label mb-1">
                Custom Time
              </label>
              <input
                id="expectedAt"
                type="text"
                className="form-control form-control-sm"
                value={handleValue("expectedAt")}
                onChange={(e) => handleChange("expectedAt", e.target.value)}
              />
            </div>
          )}
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
