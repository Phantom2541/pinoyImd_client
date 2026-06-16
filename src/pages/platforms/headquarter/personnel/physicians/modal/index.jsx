import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
} from "mdbreact";
import { useToasts } from "react-toast-notifications";

import { SearchUser } from "../../../../../../components/searchables";
import {
  SAVE,
  TAG,
  TOGGLE,
  UPDATE,
} from "../../../../../../services/redux/slices/assets/persons/physicians";
import {
  generateEmail,
  formatNameToObj,
  properFullname,
} from "../../../../../../services/utilities";

const initialForm = {
  lname: "",
  fname: "",
  mname: "",
  suffix: "",
  email: "",
  mobile: "",
  dob: "",
  isMale: true,
  specialty: "",
  status: "draft",
  affiliationsText: "",
  prcId: "",
  prcFrom: "",
  prcTo: "",
  ptrId: "",
  ptrIssuedAt: "",
  ptrIssuedBy: "",
};

const entryModes = {
  register: "register",
  temporary: "temporary",
};

const toNameForm = (source = {}) => {
  const fullName = source?.fullName || source;

  return {
    ...initialForm,
    lname: fullName?.lname || "",
    fname: fullName?.fname || "",
    mname: fullName?.mname || "",
    suffix: fullName?.suffix || "",
    email: source?.email || "",
    mobile: source?.mobile || "",
    dob: source?.dob || "",
    isMale: typeof source?.isMale === "boolean" ? source.isMale : true,
    specialty: source?.specialty || source?.specialization || "",
    status: source?.status || "draft",
    affiliationsText: Array.isArray(source?.affiliations)
      ? source.affiliations.filter(Boolean).join(", ")
      : "",
    prcId: source?.prc?.id || "",
    prcFrom: normalizeDateValue(source?.prc?.from),
    prcTo: normalizeDateValue(source?.prc?.to),
    ptrId: source?.ptr?.id || "",
    ptrIssuedAt: normalizeDateValue(source?.ptr?.issuedAt),
    ptrIssuedBy: source?.ptr?.issuedBy || "",
  };
};

const getPhysicianFormSource = (selected = {}) => {
  const baseAccount =
    selected?.account ||
    selected?.user ||
    selected?.ghost ||
    selected?.ghostName ||
    {};

  return {
    ...baseAccount,
    fullName:
      baseAccount?.fullName ||
      selected?.ghostName?.fullName ||
      selected?.ghost?.fullName ||
      selected?.user?.fullName ||
      selected?.account?.fullName ||
      {},
    specialty:
      selected?.specialty || selected?.specialization || baseAccount?.specialty,
    specialization:
      selected?.specialization ||
      selected?.specialty ||
      baseAccount?.specialization,
    status: selected?.status || baseAccount?.status,
    affiliations: selected?.affiliations || baseAccount?.affiliations,
    prc: selected?.prc || baseAccount?.prc,
    ptr: selected?.ptr || baseAccount?.ptr,
    email: baseAccount?.email || selected?.email,
    mobile: baseAccount?.mobile || selected?.mobile,
    dob: baseAccount?.dob || selected?.dob,
    isMale:
      typeof baseAccount?.isMale === "boolean"
        ? baseAccount.isMale
        : selected?.isMale,
  };
};

const getInitialSearchKey = (selected = {}) => {
  if (selected?.searchKey) return String(selected.searchKey).trim();

  const lname = String(selected?.lname || "").trim();
  const fname = String(selected?.fname || "").trim();

  if (!lname && !fname) return "";

  return `${lname}, ${fname}`.replace(/^,\s*|\s*,\s*$/g, "");
};

const normalizeAffiliations = (value = "") =>
  String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const normalizeDateValue = (value = "") => {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toISOString().slice(0, 10);
};

const buildPrc = (form = {}) => ({
  id: String(form.prcId || "").trim(),
  from: String(form.prcFrom || "").trim(),
  to: String(form.prcTo || "").trim(),
});

const buildPtr = (form = {}) => ({
  id: String(form.ptrId || "").trim(),
  issuedAt: form.ptrIssuedAt || undefined,
  issuedBy: String(form.ptrIssuedBy || "").trim(),
});

export default function Modal() {
  const { showModal, selected, willCreate, isLoading } = useSelector(
      ({ physicians }) => physicians,
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(initialForm),
    [user, setUser] = useState({}),
    [registerCandidate, setRegisterCandidate] = useState(null),
    [entryMode, setEntryMode] = useState(""),
    [initialSearchKey, setInitialSearchKey] = useState(""),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    const nextInitialSearchKey = getInitialSearchKey(selected);

    if (selected && Object.keys(selected).length > 0) {
      const selectedUser = selected?.user || {};
      const ghostName = selected?.ghostName?.fullName || selected?.ghostName;

      if (selectedUser?._id) {
        setInitialSearchKey("");
        setUser(selectedUser);
        setRegisterCandidate(null);
        setEntryMode("");
        setForm(toNameForm(getPhysicianFormSource(selected)));
        return;
      }

      if (ghostName) {
        setInitialSearchKey("");
        setUser({});
        setRegisterCandidate(ghostName);
        setEntryMode(entryModes.temporary);
        setForm(toNameForm(getPhysicianFormSource(selected)));
        return;
      }
    }

    if (showModal && nextInitialSearchKey) {
      const prefetchedName = formatNameToObj(nextInitialSearchKey);

      setInitialSearchKey(nextInitialSearchKey);
      setForm({
        ...initialForm,
        lname: prefetchedName?.lname || "",
        fname: prefetchedName?.fname || "",
        mname: prefetchedName?.mname || "",
        suffix: prefetchedName?.suffix || "",
      });
      setUser({});
      setRegisterCandidate(prefetchedName);
      setEntryMode("");
      return;
    }

    setInitialSearchKey("");
    setForm(initialForm);
    setUser({});
    setRegisterCandidate(null);
    setEntryMode("");
  }, [selected, showModal]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClose = () => dispatch(TOGGLE());

  const handlePhysicianSelect = (physician) => {
    setInitialSearchKey("");
    setUser(physician);
    setRegisterCandidate(null);
    setEntryMode("");
    setForm(toNameForm(physician));
  };

  const handleRegisterCandidate = (name) => {
    setInitialSearchKey("");
    setUser({});
    setRegisterCandidate(name);
    setEntryMode("");
    setForm((prev) => ({
      ...initialForm,
      ...prev,
      lname: name?.lname || prev?.lname || "",
      fname: name?.fname || prev?.fname || "",
      mname: name?.mname || prev?.mname || "",
      suffix: name?.suffix || prev?.suffix || "",
    }));
  };

  const handleChooseEntryMode = (mode) => {
    setEntryMode(mode);
    setForm((prev) => ({
      ...prev,
      lname: prev?.lname || registerCandidate?.lname || "",
      fname: prev?.fname || registerCandidate?.fname || "",
      mname: prev?.mname || registerCandidate?.mname || "",
      suffix: prev?.suffix || registerCandidate?.suffix || "",
    }));
  };

  const validate = () => {
    if (user?._id) return null;

    if (!entryMode) {
      return "Search and select a physician first. If none is found, choose register as user or temporary record only.";
    }

    if (!String(form.lname || "").trim() || !String(form.fname || "").trim()) {
      return "Please enter both last name and first name.";
    }

    if (entryMode === entryModes.register) {
      if (!String(form.dob || "").trim()) {
        return "Birthday is required when registering a physician as a user.";
      }
    }

    return null;
  };

  const buildTemporaryPayload = () => ({
    branch: activePlatform?.branchId,
    branchId: activePlatform?.branchId,
    isGhost: true,
    specialty: String(form.specialty || "").trim(),
    status: form.status || "draft",
    affiliations: normalizeAffiliations(form.affiliationsText),
    ghost: {
      fullName: {
        lname: String(form.lname || "").trim(),
        fname: String(form.fname || "").trim(),
        mname: String(form.mname || "").trim(),
        suffix: String(form.suffix || "").trim(),
        title: "Dr.",
      },
      isMale: Boolean(form.isMale),
      prc: buildPrc(form),
      ptr: buildPtr(form),
    },
  });

  const buildRegisterPayload = () => {
    const register = {
      fullName: {
        lname: String(form.lname || "").trim(),
        fname: String(form.fname || "").trim(),
        mname: String(form.mname || "").trim(),
        suffix: String(form.suffix || "").trim(),
        title: "Dr.",
      },
      dob: form.dob,
      email:
        String(form.email || "").trim() ||
        generateEmail({
          fullName: {
            lname: form.lname,
            fname: form.fname,
          },
          dob: form.dob,
        }),
      mobile: String(form.mobile || "").trim(),
      isMale: Boolean(form.isMale),
      password: String(form.dob || "").replaceAll("-", ""),
      prc: buildPrc(form),
      ptr: buildPtr(form),
    };

    return {
      branch: activePlatform?.branchId,
      authID: auth?._id,
      isRegister: true,
      isMajor: false,
      specialty: String(form.specialty || "").trim(),
      status: form.status || "draft",
      affiliations: normalizeAffiliations(form.affiliationsText),
      register,
    };
  };

  const buildExistingUserPayload = () => ({
    branch: activePlatform?.branchId,
    authID: auth?._id,
    user: user?._id,
    isMajor: false,
    specialty: String(form.specialty || "").trim(),
    status: form.status || "draft",
    affiliations: normalizeAffiliations(form.affiliationsText),
    prc: buildPrc(form),
    ptr: buildPtr(form),
  });

  const buildUpdatePayload = () => {
    const basePayload = {
      _id: selected?._id,
      specialty: String(form.specialty || "").trim(),
      status: form.status || "draft",
      affiliations: normalizeAffiliations(form.affiliationsText),
    };

    if (user?._id) {
      return {
        ...basePayload,
        user: user._id,
        fullName: {
          lname: String(form.lname || "").trim(),
          fname: String(form.fname || "").trim(),
          mname: String(form.mname || "").trim(),
          suffix: String(form.suffix || "").trim(),
          title: "Dr.",
        },
        email: String(form.email || "").trim(),
        mobile: String(form.mobile || "").trim(),
        dob: form.dob,
        isMale: Boolean(form.isMale),
        prc: buildPrc(form),
        ptr: buildPtr(form),
      };
    }

    if (entryMode === entryModes.register) {
      return {
        ...basePayload,
        isRegister: true,
        register: {
          fullName: {
            lname: String(form.lname || "").trim(),
            fname: String(form.fname || "").trim(),
            mname: String(form.mname || "").trim(),
            suffix: String(form.suffix || "").trim(),
            title: "Dr.",
          },
          dob: form.dob,
          email:
            String(form.email || "").trim() ||
            generateEmail({
              fullName: {
                lname: form.lname,
                fname: form.fname,
              },
              dob: form.dob,
            }),
          mobile: String(form.mobile || "").trim(),
          isMale: Boolean(form.isMale),
          password: String(form.dob || "").replaceAll("-", ""),
          prc: buildPrc(form),
          ptr: buildPtr(form),
        },
      };
    }

    return {
      ...basePayload,
      ghost: {
        fullName: {
          lname: String(form.lname || "").trim(),
          fname: String(form.fname || "").trim(),
          mname: String(form.mname || "").trim(),
          suffix: String(form.suffix || "").trim(),
          title: "Dr.",
        },
        isMale: Boolean(form.isMale),
        prc: buildPrc(form),
        ptr: buildPtr(form),
      },
    };
  };

  const shouldShowPhysicianFields = Boolean(user?._id || entryMode || !willCreate);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationMessage = validate();

    if (validationMessage) {
      addToast(validationMessage, {
        appearance: "warning",
      });
      return;
    }

    try {
      if (!willCreate) {
        await dispatch(
          UPDATE({
            data: buildUpdatePayload(),
            token,
          }),
        ).unwrap();

        addToast("Physician updated successfully.", {
          appearance: "success",
        });
      } else if (user?._id) {
        await dispatch(
          TAG({
            data: buildExistingUserPayload(),
            token,
          }),
        ).unwrap();

        addToast("Physician tagged successfully.", {
          appearance: "success",
        });
      } else if (entryMode === entryModes.register) {
        await dispatch(
          TAG({
            data: buildRegisterPayload(),
            token,
          }),
        ).unwrap();

        addToast("Physician registered and tagged successfully.", {
          appearance: "success",
        });
      } else {
        await dispatch(
          SAVE({
            data: buildTemporaryPayload(),
            token,
          }),
        ).unwrap();

        addToast("Temporary physician record saved successfully.", {
          appearance: "success",
        });
      }

      dispatch(TOGGLE());
    } catch (error) {
      addToast(
        error || "Unable to save physician record. Please review the details.",
        {
          appearance: "error",
        },
      );
    }
  };

  const renderChoicePanel = () => {
    if (!registerCandidate || entryMode || user?._id) return null;

    return (
      <div
        className="border rounded p-3 mt-3"
        style={{ background: "#f7fbff", borderColor: "#cfe8ff" }}
      >
        <div className="font-weight-bold text-primary mb-2">
          No existing user found for{" "}
          {properFullname(registerCandidate) || "this physician"}.
        </div>
        <small className="d-block text-muted mb-3">
          Choose how you want to continue before showing the input fields.
        </small>
        <div className="d-flex flex-column flex-md-row" style={{ gap: "0.75rem" }}>
          <MDBBtn
            type="button"
            color="info"
            outline
            className="m-0"
            onClick={() => handleChooseEntryMode(entryModes.register)}
          >
            Register as user
          </MDBBtn>
          <MDBBtn
            type="button"
            color="warning"
            outline
            className="m-0"
            onClick={() => handleChooseEntryMode(entryModes.temporary)}
          >
            Temporary record only
          </MDBBtn>
        </div>
      </div>
    );
  };

  const renderGhostEditModePanel = () => {
    if (willCreate || user?._id || !selected?._id) return null;

    return (
      <div
        className="border rounded p-3 mt-3"
        style={{ background: "#fffaf0", borderColor: "#f6d6a8" }}
      >
        <div className="font-weight-bold text-warning mb-2">
          This physician is currently a ghost record.
        </div>
        <small className="d-block text-muted mb-3">
          You can keep it as a temporary record, or register it as a real user
          from this edit form.
        </small>
        <div className="d-flex flex-column flex-md-row" style={{ gap: "0.75rem" }}>
          <MDBBtn
            type="button"
            color={entryMode === entryModes.temporary ? "warning" : "warning"}
            outline={entryMode !== entryModes.temporary}
            className="m-0"
            onClick={() => handleChooseEntryMode(entryModes.temporary)}
          >
            Keep as temporary
          </MDBBtn>
          <MDBBtn
            type="button"
            color="info"
            outline={entryMode !== entryModes.register}
            className="m-0"
            onClick={() => handleChooseEntryMode(entryModes.register)}
          >
            Register as user
          </MDBBtn>
        </div>
      </div>
    );
  };

  const renderDetailsFields = () => {
    const isEditMode = !willCreate;
    if (!isEditMode && !entryMode) return null;

    const isRegisterMode = entryMode === entryModes.register;
    const showExtendedProfileFields = isRegisterMode || (isEditMode && Boolean(user?._id));

    return (
      <div className="mt-3">
        <div
          className="rounded p-2 mb-3"
          style={{
            background: isRegisterMode ? "#eef8ff" : "#fff6df",
            border: `1px solid ${isRegisterMode ? "#bee3f8" : "#ffe08a"}`,
          }}
        >
          <strong>
            {isEditMode
              ? "Edit physician"
              : isRegisterMode
                ? "Register as user"
                : "Temporary record only"}
          </strong>
          <div className="small text-muted mt-1">
            {isEditMode
              ? "Update the physician profile details below."
              : isRegisterMode
              ? "A real user account will be created, then tagged as physician."
              : "Use this when details are still incomplete and you only need a temporary physician record."}
          </div>
          {isRegisterMode && !isEditMode && (
            <div className="small text-muted mt-1">
              Default password will use the birthday without dashes.
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-md-6">
            <MDBInput
              label="Last Name"
              type="text"
              value={form.lname}
              required
              onChange={(e) => handleChange("lname", e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <MDBInput
              label="First Name"
              type="text"
              value={form.fname}
              required
              onChange={(e) => handleChange("fname", e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <MDBInput
              label="Middle Name"
              type="text"
              value={form.mname}
              onChange={(e) => handleChange("mname", e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <MDBInput
              label="Suffix"
              type="text"
              value={form.suffix}
              onChange={(e) => handleChange("suffix", e.target.value)}
            />
          </div>
          {showExtendedProfileFields && (
            <>
              <div className="col-md-6">
                <MDBInput
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <MDBInput
                  label="Mobile"
                  type="text"
                  value={form.mobile}
                  onChange={(e) => handleChange("mobile", e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <MDBInput
                  label="Birthday"
                  type="date"
                  value={form.dob}
                  required
                  onChange={(e) => handleChange("dob", e.target.value)}
                />
              </div>
            </>
          )}
          <div className="col-12">
            <div className="mb-3">
              <label className="d-block text-muted small mb-2">Sex</label>
              <div className="d-flex" style={{ gap: "1rem" }}>
                <MDBInput
                  label="Male"
                  type="radio"
                  id="physician-male"
                  name="physician-sex"
                  checked={Boolean(form.isMale)}
                  onChange={() => handleChange("isMale", true)}
                />
                <MDBInput
                  label="Female"
                  type="radio"
                  id="physician-female"
                  name="physician-sex"
                  checked={!form.isMale}
                  onChange={() => handleChange("isMale", false)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPhysicianFields = () => {
    if (!shouldShowPhysicianFields) return null;

    return (
      <div className="mt-3">
        <div
          className="rounded p-2 mb-3"
          style={{ background: "#f7fbff", border: "1px solid #cfe8ff" }}
        >
          <strong>Physician details</strong>
          <div className="small text-muted mt-1">
            These fields are shown for both registered users and ghost records.
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <MDBInput
              label="Specialty"
              type="text"
              value={form.specialty}
              onChange={(e) => handleChange("specialty", e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="d-block text-muted small mb-2">Status</label>
            <select
              className="browser-default custom-select"
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="col-12">
            <MDBInput
              label="Affiliations"
              type="text"
              value={form.affiliationsText}
              onChange={(e) => handleChange("affiliationsText", e.target.value)}
            />
            <small className="text-muted d-block mt-n3 mb-2">
              Separate multiple affiliations with commas.
            </small>
          </div>
          <div className="col-md-4">
            <MDBInput
              label="PRC ID"
              type="text"
              value={form.prcId}
              onChange={(e) => handleChange("prcId", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <MDBInput
              label="PRC Valid From"
              type="date"
              value={form.prcFrom}
              onChange={(e) => handleChange("prcFrom", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <MDBInput
              label="PRC Valid To"
              type="date"
              value={form.prcTo}
              onChange={(e) => handleChange("prcTo", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <MDBInput
              label="PTR ID"
              type="text"
              value={form.ptrId}
              onChange={(e) => handleChange("ptrId", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <MDBInput
              label="PTR Issued At"
              type="date"
              value={form.ptrIssuedAt}
              onChange={(e) => handleChange("ptrIssuedAt", e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <MDBInput
              label="PTR Issued By"
              type="text"
              value={form.ptrIssuedBy}
              onChange={(e) => handleChange("ptrIssuedBy", e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <MDBModal isOpen={showModal} toggle={handleClose} backdrop size="lg">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user-md" className="mr-2" />
        {willCreate ? "Tag" : "Update"} Physician
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          {willCreate && (
            <div className="mb-3">
              <div className="font-weight-bold mb-1">Search user first</div>
              <small className="text-muted d-block mb-2">
                Search by <strong>Last Name, First Name</strong>. If no user is
                found, you can continue as a registered user or a temporary
                record.
              </small>
              {initialSearchKey ? (
                <small className="text-info d-block mb-2">
                  Loaded from your search: <strong>{initialSearchKey}</strong>
                </small>
              ) : null}
              <SearchUser
                initialSearchKey={initialSearchKey}
                setPatient={handlePhysicianSelect}
                setRegister={handleRegisterCandidate}
                notFoundMessage="No physician user found."
              />
            </div>
          )}

          {user?._id && (
            <div
              className="border rounded p-3 mb-3"
              style={{ background: "#f3fbf7", borderColor: "#c8ead8" }}
            >
              <div className="font-weight-bold text-success">
                Selected existing user
              </div>
              <div className="mt-1">
                {properFullname(user?.fullName)}
                {user?.email ? ` | ${user.email}` : ""}
              </div>
            </div>
          )}

          {renderChoicePanel()}
          {renderGhostEditModePanel()}
          {renderDetailsFields()}
          {renderPhysicianFields()}

          <div className="text-center mt-4">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              {user?._id
                ? !willCreate
                  ? "Save changes"
                  : "Tag physician"
                : entryMode === entryModes.register
                  ? !willCreate
                    ? "Register and save"
                    : "Register and tag"
                  : entryMode === entryModes.temporary
                    ? !willCreate
                      ? "Save ghost record"
                      : "Save temporary record"
                    : willCreate
                      ? "Submit"
                      : "Update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
