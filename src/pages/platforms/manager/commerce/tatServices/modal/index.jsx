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
import { PatchSessionPlatform } from "../../../../../../services/redux/slices/assets/persons/auth";

export default function Modal() {
  const {
    showModal,
    selected,
    willCreate,
    isLoading,
    department,
    collections,
  } = useSelector(({ branches }) => branches);

  const { token, activePlatform } = useSelector(({ auth }) => auth);

  const [form, setForm] = useState(selected);
  const [existingSection, setExistingSection] = useState([]);
  const { addToast } = useToasts();
  const dispatch = useDispatch();

  const { branch } = activePlatform;

  useEffect(() => {
    const used = collections.map((item) =>
      (item.section || "").toLowerCase().trim()
    );
    setExistingSection(used);
  }, [collections, showModal]);

  useEffect(() => {
    if (selected) setForm(selected);
  }, [selected]);

  const handleUpdate = () => {
    if (isEqual(form, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    const { tat = [] } = branch;
    const updatedTat = tat.map((item) =>
      item._id === selected._id ? form : item
    );

    dispatch(
      UPDATE_TAT({
        data: { _id: branch._id, tat: updatedTat },
        token,
      })
    ).then(() => {
      dispatch(
        PatchSessionPlatform({ data: { tat: updatedTat }, isBranch: true })
      ); // ✅ Proper update
      dispatch(TOGGLE());
    });
  };

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
      dispatch(PatchSessionPlatform({ data: { tat: _tat }, isBranch: true })); // ✅ Proper update
      dispatch(TOGGLE());
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalForm = {
      ...form,
      department,
    };

    if (willCreate) return handleCreate(finalForm);
    handleUpdate(finalForm);
  };

  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  const handleValue = (key) => form[key] || "";

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
                  !existingSection.includes((sec || "").toLowerCase().trim()) ||
                  sec === form.section
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
