import React, { useEffect, useState } from "react";
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
  TOGGLE,
  UPDATE,
} from "../../../../../services/redux/slices/commerce/pos/services/admission";
import { HMO } from "../../../../../services/fakeDb";
import { SetActivePlatform } from "../../../../../services/redux/slices/assets/persons/auth";
import { SearchUser } from "../../../../../components/searchables";
import { properFullname } from "../../../../../services/utilities";

export default function Modal() {
  const { showModal, selected, willCreate, isLoading, hmo } = useSelector(
      ({ admission }) => admission
    ),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected || {}),
    [collections, setCollections] = useState([]),
    dispatch = useDispatch();

  // 👇 Update filtered HMO options when modal opens or hmo list updates
  console.log("collections", collections);

  useEffect(() => {
    if (hmo && showModal) {
      const codeList = hmo.map((item) => item.code);
      const filtered = HMO.collections.filter(
        (item) => !codeList.includes(item.code)
      );
      setCollections(filtered);
    }
  }, [hmo, showModal]);

  const [showInputFields, setShowInputFields] = useState(false);

  const handlePatient = (patient) => {
    if (!patient) return;
    setForm((prev) => ({
      ...prev,
      fullName: patient.fullName, // set only the full name
      sex: patient.isMale,
    }));
    setShowInputFields(false); // hide manual input if selected from search
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleValue = (field) => form[field] || "";

  // 👇 Reset form when modal opens
  useEffect(() => {
    if (showModal) {
      setForm({});
    }
  }, [showModal]);

  // 👇 Create new HMO entry
  const handleAdd = () => {
    const newHmo = [...hmo, form];
    dispatch(
      UPDATE({
        data: { _id: activePlatform.branch.companyId._id, hmo: newHmo },
        token,
      })
    ).then(() => {
      dispatch(SetActivePlatform({ data: newHmo, isHMO: true }));
    });
    dispatch(TOGGLE()); // Close modal
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd();
  };

  const handleClose = () => dispatch(TOGGLE());

  const { cp = {} } = form;
  console.log("form", form);
  console.log("sex", form.sex);

  return (
    <MDBModal isOpen={showModal} toggle={handleClose} backdrop size="md">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "New" : "Update"} Patient
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          {/* 👇 patient Select */}
          <label>Patient Name</label>
          {/* 👇 SearchUser should only appear if user is editing or no patient selected */}
          {showInputFields || !form.fullName ? (
            <>
              <SearchUser setPatient={handlePatient} />
              <MDBInput
                label="Full Name (Format: Lastname, Firstname Middlename)"
                type="text"
                value={handleValue("fullName")}
                required
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
            </>
          ) : (
            <div className="d-flex align-items-center mt-3 ml-1">
              <MDBIcon
                icon={form?.sex ? "mars" : "venus"}
                className={`mr-2 ${form?.sex ? "text-primary" : "text-danger"}`}
              />
              <strong>{properFullname(form.fullName)}</strong>
              <MDBBtn
                size="sm"
                rounded
                color="danger"
                className="ml-2"
                onClick={() => {
                  setShowInputFields(true);
                  setForm((prev) => ({ ...prev, fullName: "" }));
                }}
              >
                <MDBIcon icon="times" />
              </MDBBtn>
            </div>
          )}

          {/* 👇 Contact Info Inputs */}
          <MDBInput
            label="Emergency"
            type="number"
            maxLength="11"
            value={cp.phone || ""}
            required
            onChange={(e) =>
              setForm({ ...form, cp: { ...cp, phone: e.target.value } })
            }
          />
          <MDBInput
            label="Email"
            type="text"
            value={cp.email || ""}
            required
            onChange={(e) =>
              setForm({ ...form, cp: { ...cp, email: e.target.value } })
            }
          />
          <MDBInput
            label="Contact Person"
            type="text"
            value={cp.agent || ""}
            required
            onChange={(e) =>
              setForm({ ...form, cp: { ...cp, agent: e.target.value } })
            }
          />

          {/* 👇 Submit Button */}
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
