import { MDBBtn, MDBIcon, MDBInput } from "mdbreact";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";

import {
  HMO,
  Privileges,
  Suffixes,
} from "../../../../../../../../services/fakeDb";
import {
  billingAddress,
  generateEmail,
  getAge,
  validateContact,
} from "../../../../../../../../services/utilities";
import AddressSelect from "../../../../../../../../components/searchables/addressSelect";
import {
  DUPLICATE_CHECKER,
  SAVE,
  UPDATE,
} from "../../../../../../../../services/redux/slices/assets/persons/users";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";
import { SETPATIENT } from "../../../../../../../../services/redux/slices/commerce/pos/services/pos";
import Swal from "sweetalert2";
import Spinner from "../../../../../../../../components/spinner";
import HealthCardFields from "./healthCard";

const defaultHealthCard = {
  provider: "",
  number: "",
  memberType: "",
  relationship: "",
  employer: "",
  plan: "",
  expiry: "",
  account: "",
};

const sanitizeHealthCard = (card = {}) => {
  const nextCard = { ...card };
  const isPhilHealth = nextCard.provider === "phi";

  if (nextCard.memberType !== "dependent") {
    delete nextCard.relationship;
    delete nextCard.account;
  }

  if (isPhilHealth) {
    delete nextCard.plan;
    delete nextCard.expiry;
  }

  Object.keys(nextCard).forEach((key) => {
    const value = nextCard[key];

    if (value === "" || value === null || value === undefined) {
      delete nextCard[key];
    }
  });

  return nextCard;
};

const getHealthCardLabel = ({ provider = "", number = "" }) =>
  `${provider === "phi" ? "PhilHealth" : HMO.getAbbr(provider) || provider || "Health Card"} - ${number || "No ID yet"}`;


export const maskEmail = (email = "") => {
  if (!email.includes("@")) return email;

  const [name, domain] = email.split("@");

  if (name.length <= 2) {
    return `${name[0]}***@${domain}`;
  }

  return `${name[0]}${"*".repeat(
    Math.max(name.length - 2, 3),
  )}${name[name.length - 1]}@${domain}`;
};

/**
 * if user is not in quest, use branch address
 * else use user quest addres
 */

export default function Patient({
  setActiveIndex,
  setShowPatientInfo = () => {},
}) {
  const { token } = useSelector(({ auth }) => auth),
    { formSubmitted } = useSelector(({ users }) => users),
    { customer } = useSelector(({ pos }) => pos),
    [form, setForm] = useState({}),
    [showAddressEditor, setShowAddressEditor] = useState(false),
    [showHealthCardEditor, setShowHealthCardEditor] = useState(false),
    [editingHealthCardIndex, setEditingHealthCardIndex] = useState(-1),
    [healthCardDraft, setHealthCardDraft] = useState(defaultHealthCard),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  // inject searched name if no match
  useEffect(() => {
    if (customer) {
      const { address = {} } =
        JSON.parse(localStorage.getItem("activePlatform"))?.branch || {};

      const _address = customer?.address?.province
        ? customer.address
        : {
            region: address?.region || "",
            province: address?.province || "",
            city: address?.city || "",
            barangay: address?.barangay || "",
            street: "",
          };

      const _form = {
        ...customer,
        address: _address,
      };

      setForm(_form);
      setShowAddressEditor(!customer?._id && !_address?.province);
      setShowHealthCardEditor(false);
      setEditingHealthCardIndex(-1);
      setHealthCardDraft(defaultHealthCard);
    }
  }, [customer]);
  // update form for selected user

  const handleChange = (key, value) => setForm({ ...form, [key]: value });
  const healthCards = Array.isArray(form?.healthCard) ? form.healthCard : [];
  const visibleHealthCards = healthCards.reduce((result, card, index) => {
    const { provider = "", number = "" } = card || {};

    if (provider || number) {
      result.push({ ...card, originalIndex: index });
    }

    return result;
  }, []);
  const editingHealthCard =
    editingHealthCardIndex > -1 ? healthCards[editingHealthCardIndex] : null;
  const {
    fullName = {},
    _id,
    dob,
    privilege,
    mobile,
    isMale,
    address,
    email,
    verified,
  } = form;

  const compactAddress = billingAddress(address);

  const resetHealthCardEditor = () => {
    setShowHealthCardEditor(false);
    setEditingHealthCardIndex(-1);
    setHealthCardDraft(defaultHealthCard);
  };

  const handleAddHealthCard = () => {
    setEditingHealthCardIndex(-1);
    setHealthCardDraft(defaultHealthCard);
    setShowHealthCardEditor(true);
  };

  const handleEditHealthCard = (index) => {
    const selectedCard = healthCards[index] || defaultHealthCard;

    setEditingHealthCardIndex(index);
    setHealthCardDraft({
      ...defaultHealthCard,
      ...selectedCard,
      account: selectedCard?.account || "",
    });
    setShowHealthCardEditor(true);
  };

  const handleDeleteHealthCard = async (index) => {
    const selectedCard = healthCards[index] || {};
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete health card?",
      text: `Remove ${getHealthCardLabel(selectedCard)} from this patient?`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
    });

    if (!result.isConfirmed) return;

    const nextHealthCards = healthCards.filter(
      (_, cardIndex) => cardIndex !== index,
    );
    handleChange("healthCard", nextHealthCards);

    if (editingHealthCardIndex === index) {
      resetHealthCardEditor();
    }
  };

  const handleSaveHealthCard = () => {
    const sanitizedCard = sanitizeHealthCard(healthCardDraft);

    if (!sanitizedCard.provider) {
      return addToast("Please select a provider first.", {
        appearance: "warning",
      });
    }

    if (!sanitizedCard.number) {
      return addToast("Card / account number is required.", {
        appearance: "warning",
      });
    }

    if (!sanitizedCard.memberType) {
      return addToast("Member type is required.", {
        appearance: "warning",
      });
    }

    const nextHealthCards = [...healthCards];

    if (editingHealthCardIndex > -1) {
      nextHealthCards[editingHealthCardIndex] = {
        ...nextHealthCards[editingHealthCardIndex],
        ...sanitizedCard,
      };
    } else {
      nextHealthCards.push(sanitizedCard);
    }

    handleChange("healthCard", nextHealthCards);
    resetHealthCardEditor();
  };

  const isDuplicate = async (data) => {
    return await dispatch(DUPLICATE_CHECKER(data)).then((action) => {
      switch (action.type) {
        case "assets/persons/users/duplicate_checker/fulfilled":
          return false;
        case "assets/persons/users/duplicate_checker/rejected":
          const { error } = action;
          Swal.fire({
            title: "Ooops...",
            text: error?.message,
            icon: "error",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Okay, I understand.",
          });
          return true;

        default:
          return true;
      }
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const _form = {
      ...form,
      ...(healthCards.length > 0 && {
        healthCard: healthCards
          .map((card) => sanitizeHealthCard(card))
          .filter((card) => Object.keys(card).length > 0),
      }),
    };
    if (_id) {
      // update
      if (!isEqual(_form, customer)) {
        const duplicate = await isDuplicate({
          data: _form,
          token,
        });
        if (!duplicate) {
          dispatch(
            UPDATE({
              data: _form,
              token,
            }),
          ).then((action) => {
            if (action.type === "assets/persons/users/update/fulfilled") {
              dispatch(SETPATIENT(action.payload.payload));
              setActiveIndex(0);
              return addToast("Successfully updated patient.", {
                appearance: "success",
              });
            }
          });
        }
      } else {
        return addToast("No changes found, skipping update.", {
          appearance: "info",
        });
      }
    } else {
      const body = {
        data: {
          ..._form,
          password: form?.dob.replaceAll("-", ""),
          email: email || generateEmail(_form),
        },
        token,
      };
      const duplicate = await isDuplicate(body);
      if (!duplicate) {
        dispatch(SAVE(body)).then((action) => {
          if (action.type === "assets/persons/users/save/fulfilled") {
            dispatch(SETPATIENT(action?.payload?.payload));
            setShowPatientInfo(true);
            setActiveIndex(0);
            return addToast("Successfully registered patient.", {
              appearance: "success",
            });
          }
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="patient-personal-container">
        <div className="patient-personal-info" data-title="Fullname">
          <div className="patient-form">
            <span>Last Name</span>
            <input
              type="text"
              value={fullName?.lname?.toUpperCase() || ""}
              onChange={({ target }) =>
                handleChange("fullName", {
                  ...fullName,
                  lname: target.value.toUpperCase(),
                })
              }
              required
            />
          </div>
          <div className="patient-form">
            <span>First Name</span>
            <input
              type="text"
              value={fullName?.fname?.toUpperCase() || ""}
              onChange={({ target }) =>
                handleChange("fullName", {
                  ...fullName,
                  fname: target.value.toUpperCase(),
                })
              }
              required
            />
          </div>
          <div className="patient-form">
            <span>Middle Name (Optional)</span>
            <input
              type="text"
              value={fullName?.mname?.toUpperCase() || ""}
              onChange={({ target }) =>
                handleChange("fullName", {
                  ...fullName,
                  mname: target.value.toUpperCase(),
                })
              }
            />
          </div>
          <div className="patient-form">
            <span>Suffix</span>
            <select
              value={fullName?.suffix || ""}
              onChange={({ target }) =>
                handleChange("fullName", {
                  ...fullName,
                  suffix: target.value === "None" ? "" : target.value,
                })
              }
            >
              {Suffixes.map((sfx) => (
                <option key={sfx} value={sfx}>
                  {sfx}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="patient-personal-info border-none">
          <div className="patient-form">
            <span>Birthday ({getAge(dob)})</span>
            <input
              type="date"
              value={dob || ""}
              onChange={({ target }) => {
                // if age is greater than 59, automatically set privilege
                const data = {
                  dob: target.value,
                  privilege: 0,
                };

                if (getAge(target.value, true) > 59) data.privilege = 2;

                setForm({ ...form, ...data });
                // handleChange("dob", target.value)
              }}
              required
            />
          </div>
          <div className="patient-form">
            <span>Privilege</span>
            <select
              disabled={getAge(dob, true) > 59}
              value={privilege}
              onChange={({ target }) =>
                handleChange("privilege", Number(target.value))
              }
            >
              {Privileges?.map((privilege, index) => {
                const isDisabled =
                  privilege === "Senior Citizen" && getAge(dob, true) < 60;

                return (
                  <option
                    disabled={isDisabled}
                    key={`priv-${privilege}`}
                    value={index}
                  >
                    {privilege}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="patient-form">
            <span>Contact Number (+63)</span>
            <input
              type="text"
              maxLength={10}
              onKeyDown={validateContact}
              value={mobile || ""}
              onChange={({ target }) => handleChange("mobile", target.value)}
            />
          </div>
          <div className="patient-form">
            <span>Gender</span>
            <div className="d-flex" style={{ gap: "20px" }}>
              <input
                checked={!isMale}
                onChange={() => handleChange("isMale", false)}
                className="form-check-input"
                type="checkbox"
                id="Female"
              />
              <label
                htmlFor="Female"
                className="form-check-label label-table pl-4"
              >
                Female
              </label>
              <input
                checked={isMale}
                onChange={() => handleChange("isMale", true)}
                className="form-check-input"
                type="checkbox"
                id="Male"
              />
              <label
                htmlFor="Male"
                className="form-check-label label-table pl-4"
              >
                Male
              </label>
            </div>
          </div>
        </div>
      </div>
      <div
        className="patient-personal-info mt-4"
        data-title="Address Information"
      >
        <div className="patient-form full-width">
          <span>Address</span>
          <div className="d-flex align-items-center" style={{ gap: "10px" }}>
            <input
              type="text"
              value={compactAddress || ""}
              placeholder="No address saved yet"
              disabled
            />
            <button
              type="button"
              title={showAddressEditor ? "Hide address editor" : "Edit address"}
              onClick={() => setShowAddressEditor((prev) => !prev)}
              style={{
                border: "1px solid #ced4da",
                background: "#fff",
                borderRadius: "4px",
                width: "38px",
                height: "38px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: showAddressEditor ? "#6c757d" : "#17a2b8",
                flexShrink: 0,
              }}
            >
              <i
                className={`fas fa-${showAddressEditor ? "times" : "pencil-alt"}`}
              />
            </button>
          </div>
        </div>
        {showAddressEditor && (
          <div className="patient-personal-info address-grid mt-3 border-none">
            <AddressSelect address={address} handleChange={handleChange} />
            <div className="patient-form full-width">
              <span>Street (Optional)</span>
              <input
                type="text"
                value={address?.street}
                onChange={({ target }) =>
                  handleChange("address", { ...address, street: target.value })
                }
              />
            </div>
          </div>
        )}
      </div>
      {/* // pag verified wala na option mag edit ng email 
      //  secrete na rin ito dahil user account, upang hindi na maabuso pa. */}
      {verified ? (
        <MDBInput label="Email" value={maskEmail(email)} disabled />
      ) : (
        <MDBInput
          label="Email (Optional)"
          type="email"
          onChange={({ target }) => handleChange("email", target.value)}
          value={email}
        />
      )}
      <div className="patient-personal-info mt-2" data-title="Health Cards">
        <div className="d-flex justify-content-end mb-2">
          <button
            type="button"
            title="Add health card"
            onClick={handleAddHealthCard}
            style={{
              border: "1px solid #17a2b8",
              background: "#fff",
              borderRadius: "4px",
              width: "32px",
              height: "32px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#17a2b8",
            }}
          >
            <MDBIcon icon="plus" />
          </button>
        </div>

        {visibleHealthCards.length > 0 ? (
          visibleHealthCards.map((card, index) => (
            <div
              key={`${card.provider || "health-card"}-${card.number || index}`}
              className="d-flex justify-content-between align-items-center py-2"
              style={{ borderBottom: "1px solid #e9ecef", gap: "12px" }}
            >
              <div
                className="d-flex align-items-center"
                style={{ gap: "10px" }}
              >
                <span style={{ fontWeight: 500 }}>
                  {getHealthCardLabel(card)}
                </span>
                {card.provider && card.provider !== "phi" && (
                  <img
                    src={HMO.getIcon(card.provider)}
                    alt={HMO.getAbbr(card.provider) || "HMO"}
                    style={{
                      width: "24px",
                      height: "24px",
                      objectFit: "contain",
                      borderRadius: "4px",
                    }}
                  />
                )}
              </div>
              <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                <button
                  type="button"
                  title="Edit health card"
                  onClick={() => handleEditHealthCard(card.originalIndex)}
                  style={{
                    border: "1px solid #ced4da",
                    background: "#fff",
                    borderRadius: "4px",
                    width: "38px",
                    height: "38px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#17a2b8",
                    flexShrink: 0,
                  }}
                >
                  <MDBIcon icon="pencil-alt" />
                </button>
                <button
                  type="button"
                  title="Delete health card"
                  onClick={() => handleDeleteHealthCard(card.originalIndex)}
                  style={{
                    border: "1px solid #ced4da",
                    background: "#fff",
                    borderRadius: "4px",
                    width: "38px",
                    height: "38px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#dc3545",
                    flexShrink: 0,
                  }}
                >
                  <MDBIcon icon="trash-alt" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted" style={{ fontSize: "0.9rem" }}>
            No health card saved yet.
          </div>
        )}

        {showHealthCardEditor && (
          <div
            className="mt-3"
            style={{
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              padding: "16px",
              background: "#fafbfc",
            }}
          >
            <div className="patient-form full-width mb-2">
              <span>Provider</span>
              <select
                value={healthCardDraft.provider || ""}
                onChange={({ target }) =>
                  setHealthCardDraft((prev) => ({
                    ...defaultHealthCard,
                    ...prev,
                    provider: target.value,
                  }))
                }
              >
                <option value="">Select provider</option>
                <option value="phi">PhilHealth</option>
                {HMO.collections
                  .filter(({ code = "" }) => code && code !== "phi")
                  .map(({ code = "", abbr = "", name = "" }) => (
                    <option key={code} value={code}>
                      {abbr || name}
                    </option>
                  ))}
              </select>
            </div>

            {healthCardDraft.provider && (
              <HealthCardFields
                form={healthCardDraft}
                setForm={setHealthCardDraft}
                providerType={
                  healthCardDraft.provider === "phi" ? "philhealth" : "hmo"
                }
              />
            )}

            <div className="d-flex justify-content-end" style={{ gap: "10px" }}>
              <button
                type="button"
                onClick={resetHealthCardEditor}
                style={{
                  border: "1px solid #ced4da",
                  background: "#fff",
                  borderRadius: "4px",
                  height: "38px",
                  padding: "0 14px",
                  color: "#6c757d",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveHealthCard}
                style={{
                  border: "1px solid #17a2b8",
                  background: "#17a2b8",
                  borderRadius: "4px",
                  height: "38px",
                  padding: "0 14px",
                  color: "#fff",
                }}
              >
                {editingHealthCard ? "Update Card" : "Save Card"}
              </button>
            </div>
          </div>
        )}
      </div>
      <MDBBtn
        type="submit"
        color={_id ? "info" : "primary"}
        className="float-right mt-n2"
        disabled={formSubmitted}
      >
        {_id ? "Update" : "Register"} <Spinner formSubmitted={formSubmitted} />
      </MDBBtn>
    </form>
  );
}
