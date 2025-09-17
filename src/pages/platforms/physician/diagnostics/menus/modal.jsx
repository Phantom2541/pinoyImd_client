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
    [form, setForm] = useState({}),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // 🔎 Sync form with redux
  useEffect(() => {
    console.log("🔎 Selected record:", selected);

    if (selected && !willCreate) {
      setForm({
        service: selected.abbreviation || "",
        description: selected.description || "",
        srp: selected.srp || "",
        discountable:
          selected.discountable === true ||
          selected.discountable === "true" ||
          selected.discountable === 1,
        doctor: selected.clinic?._id || selected.clinic || "",
        doctorFee: selected.pf || "",
      });
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

  // DTO builder
  const buildPayload = () => {
    const payload = {
      clinic: form.doctor, // doctor id
      description: form.description,
      abbreviation: form.service,
      srp: Number(form.srp),
      pf: Number(form.doctorFee),
      discountable: !!form.discountable,
      userId: auth?._id,
      branchId: activePlatform?.branchId,
    };
    console.log("🛠️ buildPayload:", payload);
    return payload;
  };

  // CREATE
  const handleCreate = () => {
    const payload = buildPayload();
    console.log("🚀 Creating with:", payload);

    dispatch(
      SAVE({
        data: payload,
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
      .catch((err) => {
        console.error("❌ Create error:", err);
        addToast("Failed to create clinic menu", { appearance: "error" });
      });
  };

  // UPDATE
  const handleUpdate = () => {
    if (isEqual(form, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    const payload = { ...buildPayload(), _id: selected._id };
    console.log("🚀 Updating with:", payload);

    dispatch(
      UPDATE({
        data: payload,
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
      .catch((err) => {
        console.error("❌ Update error:", err);
        addToast("Failed to update clinic menu", { appearance: "error" });
      });
  };

  // SUBMIT
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("📋 Final form before submit:", form);

    if (willCreate) return handleCreate();
    handleUpdate();
  };

  // STATE HELPERS
  const handleChange = (key, value) => {
    console.log(`✏️ handleChange: ${key} =`, value);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleValue = (key) => form[key] ?? "";

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
            value={handleValue("doctorFee")}
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
              checked={!!form.discountable}
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
