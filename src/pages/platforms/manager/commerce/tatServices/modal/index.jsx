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

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import { SetActivePlatform } from "../../../../../../services/redux/slices/assets/persons/auth";
const departments = [
  { label: "Laboratory", value: "LAB" },
  { label: "Radiology", value: "RAD" },
  { label: "Clinic", value: "CLINIC" },
];

export default function Modal() {
  const { showModal, selected, willCreate, isLoading } = useSelector(
      ({ branches }) => branches
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();

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
    // if (!form || !form.mode || !form.section) {
    //   alert("Please complete all required fields.");
    //   return;
    // }
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
      console.log("update_tat", _tat);

      TOGGLE();
    }); // Close modal after successful save
  };
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // sample Data {_id:id of branch,tat:[]}

    if (willCreate) return handleCreate();
    handleUpdate();

    // console.log("form", form);

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
    });
  };

  // Fix: Return correct form value
  const handleValue = (key) => form[key] || "";

  // Handle modal close
  const handleClose = () => dispatch(TOGGLE());

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
          <label>Department</label>
          <select
            className="form-control form-control-sm"
            value={handleValue("department")}
            required
            onChange={(e) => handleChange("department", e.target.value)}
          >
            <option value="">Select</option>
            {departments.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <label>Section</label>
          <select
            className="form-control form-control-sm"
            value={handleValue("section")}
            required
            onChange={(e) => handleChange("section", e.target.value)}
          >
            <option value="">Select</option>
            <option value="urinalysis">Urinalysis</option>
            <option value="hematology">Hematology</option>
            <option value="chemistry">Chemistry</option>
            <option value="microbiology">Microbiology</option>
            <option value="miscellaneous">Miscellaneous</option>
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
