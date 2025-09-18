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
  toggleModal,
  SAVE,
  UPDATE,
  SetFILTER,
} from "../../../../../services/redux/slices/diagnostics/clinic/clinicMenus";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import { properFullname } from "../../../../../services/utilities";

export default function Modal() {
  const { collections, showModal, selected, willCreate, isLoading } =
      useSelector(({ clinicMenus }) => clinicMenus),
    { token } = useSelector(({ auth }) => auth),
    { filtered = [] } = useSelector(({ physicians }) => physicians),
    [form, setForm] = useState({}),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // Initialize form when selected changes
  useEffect(() => {
    if (selected) {
      setForm(selected);
    } else {
      setForm({});
    }
  }, [selected]);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (willCreate) {
        await dispatch(SAVE({ data: form, token }));
      } else {
        if (isEqual(form, selected)) {
          return addToast("No changes found, skipping update.", {
            appearance: "info",
          });
        }
        await dispatch(UPDATE({ data: form, token }));
      }
      // ✅ Do NOT manually toggle the modal
      // The slice will set showModal = false on success
    } catch (err) {
      addToast(err.message || "Failed to save/update.", {
        appearance: "error",
      });
    }
  };

  // STATE HELPERS
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleValue = (key) => form[key] ?? "";

  const handleClose = () => dispatch(toggleModal());

  return (
    <MDBModal isOpen={showModal} toggle={handleClose} backdrop size="sm">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="clinic-medical" className="mr-2" />
        {willCreate ? "Create" : "Update"} Clinic Menu
      </MDBModalHeader>

      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBInput
            label="Professional Fee"
            type="number"
            value={handleValue("professionalFee")}
            onChange={(e) => handleChange("professionalFee", e.target.value)}
          />

          <MDBInput
            label="Services/Procedure"
            type="text"
            value={handleValue("abbreviation")}
            required
            onChange={(e) => handleChange("abbreviation", e.target.value)}
          />

          <MDBInput
            label="Description"
            type="text"
            value={handleValue("description")}
            required
            onChange={(e) => handleChange("description", e.target.value)}
          />

          <MDBInput
            label="SRP"
            type="number"
            value={handleValue("srp")}
            required
            onChange={(e) => handleChange("srp", e.target.value)}
          />

          <div className="d-flex align-items-center mb-3">
            <input
              type="checkbox"
              checked={!!form.discountable}
              onChange={(e) => handleChange("discountable", e.target.checked)}
            />
            <label className="ml-2">Discountable</label>
          </div>

          <small>Doctor / Specialist</small>
          <select
            className="form-control mb-3"
            value={form.physicianId || ""}
            onChange={(e) => handleChange("physicianId", e.target.value)}
          >
            <option value="">-- Select Doctor --</option>
            {filtered.map((doc) => {
              const displayName = properFullname(doc.user?.fullName) || "";
              return (
                <option key={doc._id} value={doc._id}>
                  {displayName}
                </option>
              );
            })}
          </select>

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
