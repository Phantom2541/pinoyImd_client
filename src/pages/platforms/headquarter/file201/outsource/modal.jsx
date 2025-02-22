import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBCol,
  MDBRow,
} from "mdbreact";
import {
  SAVE,
  UPDATE,
} from "../../../../../services/redux/slices/assets/providers";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

const _form = {
  name: "",
  subName: "",
  clients: {
    companyName: "",
    name: "",
    contacts: {
      mobile: "",
      email: "",
    },
  },
};

export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading } = useSelector(({ providers }) => providers),
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
    toggle();
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

  const handleValue = (key) =>
    willCreate ? form[key] : form[key] || selected[key];

  const handleClose = () => {
    setForm(_form);
    toggle();
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop size="m">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"}{" "}
        {selected?.clients?.companyName || "a Vendor"}
      </MDBModalHeader>

      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBCol size="15">
            <MDBInput
              label="Company"
              type="text"
              value={form.clients?.companyName || ""}
              onChange={(e) => {
                e.persist();
                setForm((prev) => ({
                  ...prev,
                  clients: { ...prev.clients, companyName: e.target.value },
                }));
              }}
            />
          </MDBCol>

          <MDBCol size="15">
            <MDBInput
              label="SubName"
              type="text"
              value={handleValue("name")}
              required
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </MDBCol>

          <MDBCol size="15">
            <MDBInput
              label="Branch"
              type="text"
              value={form.clients?.name || ""}
              onChange={(e) => {
                e.persist();
                setForm((prev) => ({
                  ...prev,
                  clients: { ...prev.clients, name: e.target.value },
                }));
              }}
            />
          </MDBCol>

          <MDBCol size="15">
            <MDBInput
              label="Subname"
              type="text"
              value={handleValue("subName")}
              required
              onChange={(e) => handleChange("subName", e.target.value)}
            />
          </MDBCol>

          <MDBRow>
            <MDBCol size="12" className="font-weight-bold">
              Contact
            </MDBCol>
          </MDBRow>

          <MDBRow>
            <MDBCol size="6">
              <MDBInput
                label="Person"
                type="text"
                value={form.clients?.contacts?.mobile || ""}
                onChange={(e) => {
                  e.persist();
                  setForm((prev) => ({
                    ...prev,
                    clients: {
                      ...prev.clients.contacts,
                      mobile: e.target.value,
                    },
                  }));
                }}
              />
            </MDBCol>

            <MDBCol size="6">
              <MDBInput
                label="Email"
                required
                type="email"
                value={form.clients?.contacts?.email || ""}
                onChange={(e) => {
                  e.persist();
                  setForm((prev) => ({
                    ...prev,
                    clients: {
                      ...prev.clients.contacts,
                      email: e.target.value,
                    },
                  }));
                }}
              />
            </MDBCol>
          </MDBRow>

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
