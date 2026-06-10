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
import { UPDATE } from "../../../../../services/redux/slices/assets/persons/users";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import {
  Cloudinary,
  PresetImage,
  signatoryName,
} from "../../../../../services/utilities";
import { Policy } from "../../../../../services/fakeDb";
import { UPDATE as UPDATE_PERSONNEL } from "../../../../../services/redux/slices/assets/persons/personnels";
// declare your expected items
const _form = {
  postnominal: "",
  id: "",
  from: "",
  to: "",
  employmentDepartment: "",
  employmentDesignation: "",
};

export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading } = useSelector(({ personnels }) => personnels),
    { token } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    [positions, setPositions] = useState([]),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (show && selected?.user?._id) {
      const departmentName =
        Policy.getDepartment(selected?.contract?.designation) || "";
      setForm({
        postnominal: selected?.user?.fullName?.postnominal || "",
        id: selected?.user?.prc?.id || "",
        from: selected?.user?.prc?.from || "",
        to: selected?.user?.prc?.to || "",
        employmentDepartment: departmentName,
        employmentDesignation: selected?.contract?.designation || "",
      });
      setPositions(Policy.getPositionsByDepartmentName(departmentName) || []);
      return;
    }

    setForm(_form);
    setPositions([]);
  }, [show, selected]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const userData = {
      fullName: {
        fname: selected.user?.fullName.fname,
        mname: selected.user?.fullName.mname,
        lname: selected.user?.fullName.lname,
        suffix: selected.user?.fullName.suffix,
        postnominal: form.postnominal,
      },
      prc: {
        id: form.id,
        from: form.from,
        to: form.to,
      },
    };
    const personnelData = {
      _id: selected?._id,
      contract: {
        ...selected?.contract,
        designation: Number(form.employmentDesignation),
      },
    };

    const original = {
      postnominal: selected?.user?.fullName?.postnominal || "",
      id: selected?.user?.prc?.id || "",
      from: selected?.user?.prc?.from || "",
      to: selected?.user?.prc?.to || "",
      employmentDepartment:
        Policy.getDepartment(selected?.contract?.designation) || "",
      employmentDesignation: selected?.contract?.designation || "",
    };

    if (isEqual(form, original))
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });

    dispatch(
      UPDATE({
        data: { ...userData, _id: selected.user?._id },
        token,
      }),
    );
    dispatch(
      UPDATE_PERSONNEL({
        data: personnelData,
        token,
      }),
    );

    setForm(_form);
    toggle();
  };
  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };
  const handleDepartmentChange = (value) => {
    setForm({
      ...form,
      employmentDepartment: value,
      employmentDesignation: "",
    });
    setPositions(Policy.getPositionsByDepartmentName(value) || []);
  };

  const profileSrc = selected?.user?.email
    ? `${Cloudinary.getEndpoint()}/${selected?.user?.pid || ""}/users/${
        selected.user.email
      }/profile.png`
    : PresetImage(selected?.user?.isMale);

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop disableFocusTrap={false}>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected.name || "staff details"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleUpdate}>
          {selected?.user?._id && (
            <div
              className="d-flex align-items-center mb-3 p-2 border rounded"
              style={{ gap: "0.75rem", backgroundColor: "#f8f9fa" }}
            >
              <img
                src={profileSrc}
                alt={selected?.user?.email || "employee"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PresetImage(selected?.user?.isMale);
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
                  {signatoryName(selected?.user?.fullName)}
                </div>
                <small className="text-muted d-block">
                  {selected?.user?.email || ""}
                </small>
              </div>
            </div>
          )}
          <MDBRow>
            <MDBCol md="12">
              <MDBInput
                type="text"
                label="Post nominal"
                value={form.postnominal}
                onChange={(e) => handleChange("postnominal", e.target.value)}
                required
                icon="user-shield"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="6">
              <label className="grey-text">Department</label>
              <select
                className="form-control"
                value={form.employmentDepartment}
                onChange={(e) => handleDepartmentChange(e.target.value)}
                required
              >
                <option value="">-- Select Department --</option>
                {[...Policy.collections]
                  .sort((a, b) => a.department.localeCompare(b.department))
                  .map((dept) => (
                    <option key={dept.department} value={dept.department}>
                      {dept.department}
                    </option>
                  ))}
              </select>
            </MDBCol>
            <MDBCol md="6">
              <label className="grey-text">Designation</label>
              <select
                className="form-control"
                value={form.employmentDesignation}
                onChange={(e) =>
                  handleChange("employmentDesignation", e.target.value)
                }
                required
              >
                <option value="">-- Select Designation --</option>
                {positions.map((position) => (
                  <option key={position.id} value={position.id}>
                    {position.display_name}
                  </option>
                ))}
              </select>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="12">
              <MDBInput
                type="text"
                label="PRC Number"
                value={form.id}
                onChange={(e) => handleChange("id", e.target.value)}
                required
                icon="user-shield"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                type="date"
                label="Acquired"
                value={form.from}
                onChange={(e) => handleChange("from", e.target.value)}
                required
                icon="calendar-alt"
              />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                type="date"
                label="Expiration"
                value={form.to}
                onChange={(e) => handleChange("to", e.target.value)}
                required
                icon="calendar-times"
              />
            </MDBCol>
          </MDBRow>
          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "submit" : "update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
