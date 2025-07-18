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
} from "../../../../../services/redux/slices/assets/companies";
import { HMO } from "../../../../../services/fakeDb";
import { SetActivePlatform } from "../../../../../services/redux/slices/assets/persons/auth";

export default function Modal() {
  const { showModal, selected, willUPDATE, isLoading, hmo } = useSelector(
      ({ companies }) => companies
    ),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected || {}),
    [collections, setCollections] = useState([]),
    dispatch = useDispatch();

  // 👇 Update filtered HMO options when modal opens or hmo list updates
  useEffect(() => {
    if (hmo && showModal) {
      const codeList = hmo.map((item) => item.code);
      const filtered = HMO.collections.filter(
        (item) => !codeList.includes(item.code)
      );
      setCollections(filtered);
    }
  }, [hmo, showModal]);

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

  const { cp = {}, code } = form;

  return (
    <MDBModal isOpen={showModal} toggle={handleClose} backdrop size="md">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willUPDATE ? "Add" : "Remove"} HMO
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          {/* 👇 HMO Select */}
          <label>HMO</label>
          <select
            className="form-control"
            value={code || ""}
            required
            onChange={(e) => {
              const selectedCode = e.target.value;
              const selectedItem = HMO.collections.find(
                (item) => item.code === selectedCode
              );
              if (selectedItem) {
                setForm({
                  ...form,
                  code: selectedItem.code,
                  name: selectedItem.name,
                  cp: { phone: "", email: "", agent: "" }, // reset contact person info
                });
              }
            }}
          >
            <option value="">Select</option>
            {collections.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>

          {/* 👇 Contact Info Inputs */}
          <MDBInput
            label="Phone"
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
              {willUPDATE ? "Submit" : "Update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
