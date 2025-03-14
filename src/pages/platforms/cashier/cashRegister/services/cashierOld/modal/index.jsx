import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBModal, MDBModalBody, MDBIcon, MDBModalHeader } from "mdbreact";
import {
  SAVE,
  UPDATE,
} from "../../../../../../services/redux/slices/assets/persons/users";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import PersonalInformation from "./personal";
import AddressInformation from "./address";
import { generateEmail } from "../../../../../../services/utilities";

// declare your expected items
const _form = {
  fullName: {
    fname: "",
    mname: "",
    lname: "",
    suffix: "",
  },
  address: {
    region: "REGION III (CENTRAL LUZON)",
    province: "NUEVA ECIJA",
    city: "CABANATUAN CITY",
    barangay: "",
    street: "",
  },
  dob: "",
  isMale: false,
  mobile: "",
  privilege: 0,
};

export default function Patron({
  show,
  toggle,
  selected,
  willCreate,
  searchKey,
}) {
  const { token } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (searchKey && show && willCreate) {
      const [lname, rest = ""] = searchKey?.toUpperCase().split(", "),
        [fname, mname = ""] = rest.split(" Y ");

      setForm((prev) => ({
        ...prev,
        fullName: {
          ...prev.fullName,
          lname,
          fname,
          mname,
        },
      }));
    }
  }, [searchKey, show, willCreate]);

  useEffect(() => {
    if (selected._id && !willCreate) setForm(selected);
  }, [selected, willCreate]);

  const handleUpdate = () => {
    toggle();

    // check if object has changed
    if (isEqual(form, selected))
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });

    dispatch(
      UPDATE({
        data: { ...form, _id: selected._id },
        token,
      })
    );

    setForm(_form);
  };

  const handleCreate = () => {
    dispatch(
      SAVE({
        data: { ...form, password: "password", email: generateEmail(form) },
        token,
      })
    );

    setForm(_form);
    toggle();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) {
      return handleCreate();
    }

    handleUpdate();
  };

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  return (
    <MDBModal
      isOpen={show}
      size="xl"
      toggle={toggle}
      backdrop={true}
      disableFocusTrap={false}
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user-injured" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected.name || "a User"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <PersonalInformation form={form} handleChange={handleChange} />

          <AddressInformation
            form={form}
            handleChange={handleChange}
            willCreate={willCreate}
          />
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
