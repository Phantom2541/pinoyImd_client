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
  SetFILTER,
  SetHMO,
} from "../../../../../services/redux/slices/assets/companies";
import { HMO } from "../../../../../services/fakeDb";
import { PatchSessionPlatform } from "../../../../../services/redux/slices/assets/persons/auth";
import { UPDATE as UPDATE_BRANCH } from "../../../../../services/redux/slices/assets/branches";

export default function Modal() {
  const { showModal, selected, willUPDATE, isLoading, hmo } = useSelector(
      ({ companies }) => companies
    ),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected || {}),
    [collections, setCollections] = useState([]),
    dispatch = useDispatch();

  const normalizedContacts = {
    person: selected?.contacts?.person || selected?.cp?.agent || "",
    mobile: selected?.contacts?.mobile || selected?.cp?.phone || "",
    email: selected?.contacts?.email || selected?.cp?.email || "",
  };

  // 👇 Update filtered HMO options when modal opens or hmo list updates
  useEffect(() => {
    if (hmo && showModal) {
      const codeList = hmo.map((item) => item.provider || item.code);
      const filtered = HMO.collections.filter(
        (item) =>
          item.code === selected?.provider || !codeList.includes(item.code)
      );
      setCollections(filtered);
    }
  }, [hmo, selected, showModal]);

  // 👇 Reset form when modal opens
  useEffect(() => {
    if (showModal) {
      setForm(
        selected?.provider || selected?.code
          ? {
              ...selected,
              provider: selected?.provider || selected?.code || "",
              contacts: normalizedContacts,
            }
          : {
              contacts: {
                person: "",
                mobile: "",
                email: "",
              },
            }
      );
    }
  }, [normalizedContacts, selected, showModal]);

  // 👇 Create new HMO entry
  const handleAdd = () => {
    const isEditing = Boolean(
      selected?._id || selected?.provider || selected?.code
    );
    const newHmo = isEditing
      ? hmo.map((item) => {
          const sameById =
            selected?._id &&
            item?._id &&
            String(item._id) === String(selected._id);
          const sameByCode =
            !selected?._id &&
            item?.provider === (selected?.provider || selected?.code);

          return sameById || sameByCode ? { ...item, ...form } : item;
        })
      : [...hmo, form];
    dispatch(
      UPDATE_BRANCH({
        data: { _id: activePlatform.branchId, hmo: newHmo },
        token,
      })
    ).then(({ payload }) => {
      const updatedBranch = payload?.payload;
      if (!updatedBranch) return;

      dispatch(SetHMO(updatedBranch.hmo || []));
      dispatch(SetFILTER(updatedBranch.hmo || []));
      dispatch(PatchSessionPlatform({ data: updatedBranch, isBranch: true }));
    });
    dispatch(TOGGLE()); // Close modal
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd();
  };

  const handleClose = () => dispatch(TOGGLE());

  const { contacts = {}, provider } = form;

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
            value={provider || ""}
            required
            onChange={(e) => {
              const selectedCode = e.target.value;
              const selectedItem = HMO.collections.find(
                (item) => item.code === selectedCode
              );
              if (selectedItem) {
                setForm({
                  ...form,
                  provider: selectedItem.code,
                  contacts: {
                    person: form?.contacts?.person || "",
                    mobile: form?.contacts?.mobile || "",
                    email: form?.contacts?.email || "",
                  },
                });
              }
            }}
          >
            <option value="">Select</option>
            {collections
              .slice() // make a shallow copy so the original isn't mutated
              .sort((a, b) => a.name.localeCompare(b.name)) // sort alphabetically
              .map((item) => (
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
            value={contacts.mobile || ""}
            required
            onChange={(e) =>
              setForm({
                ...form,
                contacts: { ...contacts, mobile: e.target.value },
              })
            }
          />
          <MDBInput
            label="Email"
            type="text"
            value={contacts.email || ""}
            required
            onChange={(e) =>
              setForm({
                ...form,
                contacts: { ...contacts, email: e.target.value },
              })
            }
          />
          <MDBInput
            label="Contact Person"
            type="text"
            value={contacts.person || ""}
            required
            onChange={(e) =>
              setForm({
                ...form,
                contacts: { ...contacts, person: e.target.value },
              })
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
