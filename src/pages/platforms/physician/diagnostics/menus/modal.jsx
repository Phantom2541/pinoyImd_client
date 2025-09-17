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
} from "../../../../../services/redux/slices/diagnostics/clinic/clinicMenus";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import { properFullname } from "../../../../../services/utilities";

export default function Modal() {
  const { show, selected, willCreate, isLoading } = useSelector(
      ({ clinicMenus }) => clinicMenus
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { filtered = [] } = useSelector(({ physicians }) => physicians),
    [form, setForm] = useState(selected || {}),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  console.log("filtered", filtered);

  useEffect(() => {
    if (selected) {
      setForm(selected);
    } else if (willCreate) {
      setForm({
        service: "",
        description: "",
        srp: "",
        discountable: false,
        doctor: "",
        doctorFee: "",
      });
    }
  }, [selected, willCreate]);

  // Handle update
  const handleUpdate = () => {
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
    )
      .unwrap()
      .then(() => {
        addToast("Clinic menu updated successfully", {
          appearance: "success",
        });
        dispatch(toggleModal());
      })
      .catch(() =>
        addToast("Failed to update clinic menu", { appearance: "error" })
      );
  };

  // Handle create
  const handleCreate = () => {
    dispatch(
      SAVE({
        data: form,
        token,
      })
    )
      .unwrap()
      .then(() => {
        addToast("Clinic menu created successfully", {
          appearance: "success",
        });
        dispatch(toggleModal());
      })
      .catch(() =>
        addToast("Failed to create clinic menu", { appearance: "error" })
      );
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (willCreate) return handleCreate();
    handleUpdate();
  };

  // Handle change
  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
      userId: auth._id,
      branchId: activePlatform.branchId,
    });
  };

  // Get field value safely
  const handleValue = (key) => form[key] || "";

  // Close modal
  const handleClose = () => dispatch(toggleModal());

  return (
    <MDBModal isOpen={show} toggle={handleClose} backdrop size="sm">
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
            value={handleValue("ProfessionalFee")}
            onChange={(e) => handleChange("doctorFee", e.target.value)}
          />
          <MDBInput
            label="Services/Procedure"
            type="text"
            value={handleValue("service")}
            required
            onChange={(e) => handleChange("service", e.target.value)}
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
              checked={form.discountable || false}
              onChange={(e) => handleChange("discountable", e.target.checked)}
            />
            <label className="ml-2">Discountable</label>
          </div>
          <small>Doctor / Specialist</small>
          <select
            className="form-control mb-3"
            value={form.doctor || ""}
            onChange={(e) => handleChange("doctor", e.target.value)}
          >
            <option value="">-- Select Doctor --</option>
            {filtered.map((doc) => {
              const displayName = properFullname(doc.user?.fullName) || {};

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
