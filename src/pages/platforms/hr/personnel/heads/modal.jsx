import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdbreact";

import {
  SAVE,
  UPDATE,
  TOGGLE,
  RESET,
} from "../../../../../services/redux/slices/assets/persons/heads";
import { capitalize, isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import {
  Cloudinary,
  PresetUser,
  signatoryName,
} from "../../../../../services/utilities";
import { Select } from "../../../../../components/customizable";
import { SelectUser } from "../../../../../components/searchables";
import Templates from "../../../../../services/fakeDb/diagnostics/templates";
import { Policy } from "../../../../../services/fakeDb";

const _form = {
  user: "",
  designation: null,
  position: "",
  department: "",
  section: "",
  status: "active",
  prc: { id: "", from: "", to: "" },
};

// restriction map
const restrictions = {
  Pathologist: [42, 43],
  Radiologist: [48, 49],
  Laboratory: [38, 39, 40, 41],
  Radiology: [44, 45, 46, 47],
};

export default function Modal({ show, selected, willCreate }) {
  const { collections } = useSelector(({ personnels }) => personnels),
    { formSubmitted } = useSelector(({ heads }) => heads),
    [crews, setCrews] = useState([]),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    [selectedUser, setSelectedUser] = useState(null),
    [signatoryType, setSignatoryType] = useState("employee"),
    [department, setDepartment] = useState(activePlatform?.department),
    [sections, setSections] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (activePlatform?.departments === department) {
      const _sections = Templates.getComponents(
        department === "Laboratory" ? "LAB" : "RAD",
      );
      _sections.push(
        department === "Laboratory" ? "Pathologist" : "Radiologist",
      );
      setSections(_sections);
    }
  }, [department, activePlatform]);

  useEffect(() => {
    let positions = Policy.getPositionsByDepartmentName(
      !willCreate ? capitalize(selected.department) : department,
    ).map(({ id }) => id);

    // apply restriction rules
    if (form.section && restrictions[form.section]) {
      positions = positions.filter((id) =>
        restrictions[form.section].includes(id),
      );
    } else if (restrictions[capitalize(department)]) {
      positions = positions.filter((id) =>
        restrictions[capitalize(department)].includes(id),
      );
    }

    const _crew = collections.filter(({ contract }) =>
      positions.includes(contract?.designation),
    );
    setCrews(_crew);
  }, [collections, department, selected, willCreate, form.section]);

  useEffect(() => {
    if (show && !willCreate && selected._id) {
      const selectedDepartment = capitalize(selected?.department || "");
      const nextSections = selectedDepartment
        ? Templates.getComponents(
            selectedDepartment === "Laboratory" ? "LAB" : "RAD",
          )
        : [];

      if (selectedDepartment) {
        nextSections.push(
          selectedDepartment === "Laboratory"
            ? "Pathologist"
            : "Radiologist",
        );
      }

      setForm({
        ...selected,
        user: selected?.user?._id || "",
        designation: selected?.designation ?? null,
        position: selected?.position || "",
        status: selected?.status || "active",
        prc: selected?.user?.prc || selected?.prc || _form.prc,
      });
      setDepartment(selectedDepartment || activePlatform?.department || "");
      setSections(nextSections);
      setSelectedUser(selected?.user || null);
      setSignatoryType(selected?.status === "ghost" ? "ghost" : "employee");
      return;
    }

    setForm(_form);
    setDepartment(activePlatform?.department || "");
    setSelectedUser(null);
    setSignatoryType("employee");
  }, [show, willCreate, selected]);

  const handleUpdate = (data = form) => {
    if (isEqual(form, selected))
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });

    dispatch(
      UPDATE({
        data: { ...data, id: selected._id },
        token,
      }),
    );
  };

  const handleCreate = (data = form) => {
    dispatch(
      SAVE({
        data: { ...data, branch: activePlatform?.branchId },
        token,
      }),
    ).then(() => {
      dispatch(TOGGLE());
      dispatch(RESET());
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // find designation of selected staff
    const selectedCrew = collections.find(({ user }) => user._id === form.user);
    const designation = selectedCrew?.contract?.designation;
    const isGhost =
      signatoryType === "ghost" || String(form.status).toLowerCase() === "ghost";
    const roleLabel =
      form.section ||
      (form.department ? capitalize(form.department) : "") ||
      form.position ||
      "";

    // pick allowed list depending on section or department
    let allowed = [];
    if (form.section && restrictions[form.section]) {
      allowed = restrictions[form.section];
    } else if (restrictions[capitalize(form.department)]) {
      allowed = restrictions[capitalize(form.department)];
    }

    // block if designation not valid
    if (!isGhost && designation && allowed.length && !allowed.includes(designation)) {
      return addToast("Invalid staff selection for this section/department.", {
        appearance: "error",
      });
    }

    const payload = {
      ...form,
      designation: isGhost ? null : designation ?? form.designation ?? null,
      position: isGhost
        ? roleLabel
        : Policy.getPosition(designation) || roleLabel || "",
    };

    if (willCreate) {
      return handleCreate(payload);
    }

    handleUpdate(payload);
  };

  const handleSectionChange = (section) => {
    console.log(section);

    if (section === "2 Dimensional Echo") {
      section = "2DEcho";
      setForm({
        ...form,
        position: section,
        section,
      });
    } else {
      setForm({
        ...form,
        position: section,
        section,
      });
    }
  };

  const { user = {} } =
    [...crews].find(({ user }) => user._id === form?.user) || {};
  const activeUser = selectedUser || user || {};
  const activePrc = activeUser?.prc || {};

  const handleStaffChange = (user) => {
    const crew = crews.find(({ user: crewUser }) => crewUser._id === user);
    const nextUser = crew?.user || null;
    const nextDesignation = crew?.contract?.designation ?? null;

    setForm({
      ...form,
      user,
      designation: nextDesignation,
      position: Policy.getPosition(nextDesignation) || form.position || "",
      prc: nextUser?.prc || { id: "", from: "", to: "" },
    });
    setSelectedUser(nextUser);
  };

  const handleGhostChange = (user) => {
    setSelectedUser(user);
    setForm({
      ...form,
      user: user?._id || "",
      designation: null,
      position:
        form.section || (form.department ? capitalize(form.department) : "") || "",
      prc: user?.prc || { id: "", from: "", to: "" },
    });
  };

  const handleSignatoryTypeChange = (type) => {
    const normalizedType = String(type || "").toLowerCase();
    setSignatoryType(normalizedType);
    setSelectedUser(null);
    setForm({
      ...form,
      user: "",
      designation: null,
      position: "",
      status: normalizedType === "ghost" ? "ghost" : "active",
      prc: { id: "", from: "", to: "" },
    });
  };

  const handleDepartmentChange = (department) => {
    setDepartment(department);
    setForm({
      ...form,
      department: department.toLowerCase(),
      position: form.section || department,
    });
    const _sections = Templates.getComponents(
      department === "Laboratory" ? "LAB" : "RAD",
    );
    _sections.push(department === "Laboratory" ? "Pathologist" : "Radiologist");
    setSections(_sections);
  };

  const handleClose = () => {
    dispatch(TOGGLE());
  };

  const profileSrc = activeUser?.email
    ? `${Cloudinary.getEndpoint()}/${activeUser?.pid || ""}/users/${
        activeUser.email
      }/profile.png`
    : PresetUser;

  return (
    <MDBModal
      isOpen={show}
      toggle={handleClose}
      backdrop
      disableFocusTrap={false}
    >
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Designate" : "Update"} {selected.name || " head"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBCol>
            {willCreate && (
              <Select
                className="mb-1"
                collections={["Employee", "Ghost"]}
                preValue={capitalize(signatoryType)}
                label={"Signatory Type"}
                multiple={false}
                onChange={handleSignatoryTypeChange}
              />
            )}

            <Select
              className="mb-1"
              collections={["Radiology", "Laboratory"]}
              preValue={capitalize(form.department)}
              label={"Department"}
              multiple={false}
              onChange={handleDepartmentChange}
            />

            <Select
              className="mb-1"
              collections={sections}
              onChange={handleSectionChange}
              preValue={form.section}
              label={"Sections"}
              multiple={false}
            />

            {signatoryType === "ghost" ? (
              <div className="mb-1">
                <SelectUser
                  label="Ghost User"
                  selectedUser={selectedUser || {}}
                  setUser={handleGhostChange}
                />
              </div>
            ) : (
              <Select
                className="mb-1"
                collections={crews.map((crew) => ({
                  _id: crew?.user?._id,
                  fullName: `${signatoryName(
                    crew?.user?.fullName,
                  )} - ${Policy.getPosition(crew?.contract?.designation)}`,
                }))}
                onChange={handleStaffChange}
                preValue={form.user}
                label={"Staff"}
                keys={"_id"}
                values={"fullName"}
              />
            )}
          </MDBCol>

          {form.user && (
            <div
              className="d-flex align-items-center mb-3 p-2 border rounded"
              style={{ gap: "0.75rem", backgroundColor: "#f8f9fa" }}
            >
              <img
                src={profileSrc}
                alt={activeUser?.email || "staff"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PresetUser;
                }}
                style={{
                  width: "64px",
                  height: "64px",
                  objectFit: "cover",
                  borderRadius: "50%",
                  border: "2px solid #dee2e6",
                  backgroundColor: "#fff",
                }}
              />
              <div className="text-left">
                <div className="font-weight-bold">
                  {signatoryName(activeUser?.fullName)}
                </div>
                <small className="text-muted d-block">
                  {form.position || form.section || capitalize(form.department)}
                </small>
                {activeUser?.email && (
                  <small className="text-muted d-block">{activeUser.email}</small>
                )}
              </div>
            </div>
          )}

          {form.user && (
            <MDBRow>
              <MDBCol md="4">
                <MDBInput
                  label="PRC ID"
                  value={form?.prc?.id || activePrc?.id}
                  onChange={({ target }) =>
                    setForm({ ...form, prc: { ...form.prc, id: target.value } })
                  }
                />
              </MDBCol>
              <MDBCol md="4">
                <MDBInput
                  label="Register"
                  type="date"
                  value={form?.prc?.from || activePrc?.from}
                  onChange={({ target }) =>
                    setForm({
                      ...form,
                      prc: { ...form.prc, from: target.value },
                    })
                  }
                />
              </MDBCol>
              <MDBCol md="4">
                <MDBInput
                  label="Expiration"
                  type="date"
                  value={form?.prc?.to || activePrc?.to}
                  onChange={({ target }) =>
                    setForm({ ...form, prc: { ...form.prc, to: target.value } })
                  }
                />
              </MDBCol>
            </MDBRow>
          )}
          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={formSubmitted}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "submit" : "update"}{" "}
              {formSubmitted && (
                <MDBIcon icon="spinner" pulse className="ml-2" />
              )}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
