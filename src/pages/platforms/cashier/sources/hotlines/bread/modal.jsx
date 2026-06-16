import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBadge,
  MDBBtn,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBRow,
} from "mdbreact";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

import {
  SAVE,
  TOGGLE,
  UPDATE,
} from "../../../../../../services/redux/slices/assets/providers";
import { removeUndefinedValues } from "../../../../../../services/utilities";
import Spinner from "../../../../../../components/spinner";

const baseForm = {
  displayname: "",
  address: "",
  number: "",
};

const stations = [
  {
    value: "Police Station",
    icon: "shield-alt",
    accent: "#2f6fed",
    tone: "#edf4ff",
  },
  {
    value: "Fire Station",
    icon: "fire-extinguisher",
    accent: "#df5a3b",
    tone: "#fff1eb",
  },
  {
    value: "Ambulance (EMS)",
    icon: "ambulance",
    accent: "#239a6b",
    tone: "#ecfbf4",
  },
  {
    value: "Hospital",
    icon: "hospital",
    accent: "#5767d9",
    tone: "#eef2ff",
  },
  {
    value: "Barangay Hall",
    icon: "building",
    accent: "#c58b12",
    tone: "#fff8ea",
  },
  {
    value: "Red Cross",
    icon: "plus-square",
    accent: "#d54f73",
    tone: "#fff1f5",
  },
];

export default function Modal() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { showModal, selected, willCreate, formSubmitted, isSuccess } = useSelector(
      ({ providers }) => providers,
    ),
    [form, setForm] = useState(baseForm),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const toggle = useCallback(() => {
    dispatch(TOGGLE());
  }, [dispatch]);

  useEffect(() => {
    if (!showModal) return;

    setForm({
      ...baseForm,
      ...selected,
    });
  }, [showModal, selected, auth, activePlatform]);

  useEffect(() => {
    if (!formSubmitted && isSuccess && showModal) toggle();
  }, [toggle, showModal, formSubmitted, isSuccess]);

  const handleUpdate = (payload = form) => {
    if (isEqual(payload, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    dispatch(
      UPDATE({
        data: { ...payload },
        token,
      }),
    );
  };

  const handleCreate = (payload = form) => {
    dispatch(
      SAVE({
        data: {
          ...payload,
          userId: auth._id,
          clients: activePlatform.branchId,
          category: "hotline",
        },
        token,
      }),
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedForm = removeUndefinedValues(form);

    setForm(cleanedForm);
    willCreate ? handleCreate(cleanedForm) : handleUpdate(cleanedForm);
  };

  const handleChange = (key, value) =>
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

  return (
    <MDBModal isOpen={showModal} toggle={toggle} backdrop size="lg">
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="phone-alt" className="mr-2" />
        {willCreate ? "Create" : "Update"} Hotline
      </MDBModalHeader>
      <MDBModalBody className="mb-0 px-4 pb-4">
        <form onSubmit={handleSubmit}>
          <div
            className="mb-4 p-3"
            style={{
              background: "linear-gradient(135deg, #f4f8ff 0%, #eef7ff 100%)",
              border: "1px solid #d7e7fb",
              borderRadius: "14px",
            }}
          >
            <div className="d-flex justify-content-between align-items-start flex-wrap">
              <div className="pr-3">
                <div className="font-weight-bold text-dark mb-1">
                  Emergency Contact Details
                </div>
                <div className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Pick the hotline type first, then enter the branch-specific
                  contact info.
                </div>
              </div>
              <MDBBadge color={willCreate ? "info" : "primary"}>
                {willCreate ? "New Hotline" : "Editing"}
              </MDBBadge>
            </div>
          </div>

          <MDBRow className="align-items-start">
            <MDBCol lg="6" className="mb-3 mb-lg-0">
              <div
                className="h-100 p-3"
                style={{
                  background: "#fbfdff",
                  border: "1px solid #e1ebf5",
                  borderRadius: "14px",
                }}
              >
                <label
                  className="font-weight-bold text-muted mb-3"
                  style={{ fontSize: "0.82rem", letterSpacing: "0.04em" }}
                >
                  HOTLINE TYPE
                </label>
                <MDBRow>
                  {stations.map(({ value, icon, accent, tone }) => {
                    const isActive = form?.displayname === value;

                    return (
                      <MDBCol md="6" className="mb-3" key={value}>
                        <button
                          type="button"
                          onClick={() => handleChange("displayname", value)}
                          style={{
                            width: "100%",
                            minHeight: "88px",
                            textAlign: "left",
                            borderRadius: "14px",
                            border: isActive
                              ? `2px solid ${accent}`
                              : "1px solid #dbe6f2",
                            background: isActive ? tone : "#fff",
                            padding: "0.9rem 1rem",
                            boxShadow: isActive
                              ? "0 10px 24px rgba(30, 80, 140, 0.10)"
                              : "none",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <div
                              className="d-flex align-items-center justify-content-center mr-3"
                              style={{
                                width: "2.5rem",
                                height: "2.5rem",
                                borderRadius: "12px",
                                background: tone,
                                color: accent,
                                fontSize: "1rem",
                                flexShrink: 0,
                              }}
                            >
                              <MDBIcon icon={icon} />
                            </div>
                            <div>
                              <div
                                className="font-weight-bold text-dark"
                                style={{ fontSize: "0.95rem", lineHeight: 1.2 }}
                              >
                                {value}
                              </div>
                              <small className="text-muted">
                                {isActive
                                  ? "Selected hotline type"
                                  : "Click to select"}
                              </small>
                            </div>
                          </div>
                        </button>
                      </MDBCol>
                    );
                  })}
                </MDBRow>
              </div>
            </MDBCol>

            <MDBCol lg="6">
              <div
                className="h-100 p-3"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e1ebf5",
                  borderRadius: "14px",
                }}
              >
                <label
                  className="font-weight-bold text-muted mb-2"
                  style={{ fontSize: "0.82rem", letterSpacing: "0.04em" }}
                >
                  CONTACT DETAILS
                </label>

                <MDBInput
                  label="Phone Number"
                  value={form?.number}
                  required
                  onChange={({ target }) =>
                    handleChange("number", target.value)
                  }
                />

                <MDBInput
                  type="textarea"
                  rows="4"
                  label="Address / location details"
                  value={form?.address}
                  onChange={({ target }) =>
                    handleChange("address", target.value)
                  }
                />

                <div
                  className="d-flex align-items-center mb-2 px-3 py-2"
                  style={{
                    background: "#f8fafc",
                    border: "1px dashed #d7e0ea",
                    borderRadius: "12px",
                  }}
                >
                  <MDBIcon icon="info-circle" className="text-info mr-2" />
                  <small className="text-muted mb-0">
                    Add the direct number and exact location so staff can reach
                    the right emergency contact quickly.
                  </small>
                </div>
              </div>
            </MDBCol>
          </MDBRow>

          <div className="d-flex justify-content-end">
            <MDBBtn
              type="submit"
              disabled={formSubmitted || !form?.displayname}
              color="info"
              className="mb-0 px-4"
              rounded
            >
              <MDBIcon
                icon={willCreate ? "plus-circle" : "save"}
                className="mr-2"
              />
              {willCreate ? "Create Hotline" : "Save Changes"}{" "}
              <Spinner formSubmitted={formSubmitted} />
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
