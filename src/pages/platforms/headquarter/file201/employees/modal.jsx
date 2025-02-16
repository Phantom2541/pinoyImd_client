import React, { useState } from "react";
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
// declare your expected items
const _form = {
  fullName: {},
  prc: {},
};

export default function Modal({ show, toggle, selected, willCreate, users }) {
  const { isLoading } = useSelector(({ personnels }) => personnels),
    { token } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const handleUpdate = () => {
    toggle();
    const data = {
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
    console.log("data", data);
    // check if object has changed
    if (isEqual(form, selected))
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });

    dispatch(
      UPDATE({
        data: { ...data, _id: selected.user?._id },
        token,
      })
    );

    setForm(_form);
  };
  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };
  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop disableFocusTrap={false}>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected.name || "a Staff"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleUpdate}>
          <MDBRow>
            <MDBCol md="12">
              <MDBInput
                type="text"
                label="Post nominal"
                value={users.fullName?.postnominal}
                onChange={(e) => handleChange("postnominal", e.target.value)}
                required
                icon="user-shield"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="12">
              <MDBInput
                type="text"
                label="Lisences #"
                value={users.prc?.id}
                onChange={(e) => handleChange("id", e.target.value)}
                required
                icon="user-shield"
              />
            </MDBCol>
            <MDBCol md="12">
              <MDBInput
                type="date"
                label="Lisences from"
                value={users.prc?.id}
                onChange={(e) => handleChange("from", e.target.value)}
                required
                icon="user-shield"
              />
            </MDBCol>
            <MDBCol md="12">
              <MDBInput
                type="date"
                label="Lisences to"
                value={users.prc?.id}
                onChange={(e) => handleChange("to", e.target.value)}
                required
                icon="user-shield"
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
