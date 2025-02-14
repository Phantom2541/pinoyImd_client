import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBRow,
  MDBCol,
} from "mdbreact";
import {
  SAVE,
  UPDATE,
} from "../../../../../../../services/redux/slices/assets/branches";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

// declare your expected items
const _form = {
  name: "",
  address: {
    street: "",
    barangay: "",
    city: "",
    region: "",
    province: "",
  },
  contacts: {
    email: "",
    mobile: "",
  },
};

export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading } = useSelector(({ personnels }) => personnels),
    { token, onDuty } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    if (!willCreate && selected._id) {
      setForm(selected);
    }
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
        data: {
          ...form,
          companyName: onDuty.companyId?.name,
          companyId: onDuty.companyId?._id,
        },
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

  // use for direct values like strings and numbers
  const handleValue = (key) =>
    willCreate ? form[key] : form[key] || selected[key];

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleObjValue = (obj, key) =>
    willCreate ? form[obj][key] : form[obj][key] || selected[obj][key];

  const handleObjChange = (obj, key, value) => {
    const _obj = { ...form[obj] };
    _obj[key] = value.toUpperCase();
    setForm({ ...form, [obj]: _obj });
  };

  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="xl"
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="building" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected.name || "a Branch"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="4">
              <MDBInput
                type="text"
                label="Name"
                value={handleValue("name")}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                icon="building"
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                type="text"
                label="Mobile Number"
                value={handleObjValue("contacts", "mobile")}
                onChange={(e) =>
                  handleObjChange("contacts", "mobile", e.target.value)
                }
                required
                icon="mobile"
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                type="email"
                label="Email"
                value={handleObjValue("contacts", "email")}
                onChange={(e) =>
                  handleObjChange("contacts", "email", e.target.value)
                }
                required
                icon="envelope"
              />
            </MDBCol>
          </MDBRow>

          <MDBRow>
            <MDBCol md="4">
              <MDBInput
                type="text"
                value={handleObjValue("address", "region")}
                onChange={(e) =>
                  handleObjChange("address", "region", e.target.value)
                }
                label="Region"
                required
                icon="city"
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                type="text"
                value={handleObjValue("address", "province")}
                onChange={(e) =>
                  handleObjChange("address", "province", e.target.value)
                }
                label="Province"
                required
                icon="monument"
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                type="text"
                value={handleObjValue("address", "city")}
                onChange={(e) =>
                  handleObjChange("address", "city", e.target.value)
                }
                icon="kaaba"
                label="City/Municipality"
                required
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                type="text"
                value={handleObjValue("address", "barangay")}
                onChange={(e) =>
                  handleObjChange("address", "barangay", e.target.value)
                }
                icon="road"
                label="Barangay"
              />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                type="text"
                value={handleObjValue("address", "street")}
                onChange={(e) =>
                  handleObjChange("address", "street", e.target.value)
                }
                label="Street"
                icon="street-view"
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
