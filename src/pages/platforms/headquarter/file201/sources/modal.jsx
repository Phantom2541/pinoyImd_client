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
  SAVE,
  UPDATE,
} from "../../../../../services/redux/slices/assets/persons/source";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
// declare your expected items
const _form = {};

export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading } = useSelector(({ sources }) => sources),
    { token } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (!willCreate && show) {
      setForm(selected);
    }
  }, [willCreate, selected, show]);

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
        data: form,
        token,
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) {
      return handleCreate();
    }

    handleUpdate();
  };

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleValue = (key) => (willCreate ? form[key] : form[key] || selected);

  const handleClose = () => {
    setForm(_form);
    toggle();
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="sm">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected || "a Vendors"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBInput
            label="Name"
            type="text"
            value={handleValue("name")}
            required
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <div className="text-center mb-1-half; ">
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
