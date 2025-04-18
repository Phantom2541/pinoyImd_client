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
} from "../../../../services/redux/slices/assets/branches";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import { Philippines } from "../../../../services/fakeDb";

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
    { token, activePlatform } = useSelector(({ auth }) => auth),
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
          displayname: activePlatform.companyId?.name,
          companyId: activePlatform.companyId?._id,
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
    // don't force uppercase on location keys
    const noCaps = ["region", "province", "city", "barangay", "street"];
    _obj[key] = noCaps.includes(key) ? value : value.toUpperCase();
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
        {willCreate ? "Create" : "Update Branch "} {selected.name || "a Branch"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="4">
              <MDBInput
                type="text"
                label="Branch Name"
                value={handleValue("name")}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                icon="building"
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                type="text"
                label="Display Name"
                value={handleValue("displayname")}
                onChange={(e) => handleChange("displayname", e.target.value)}
                required
                icon="building"
              />
            </MDBCol>
            <MDBCol md="4">
              <MDBInput
                type="text"
                label="Acronym"
                value={handleValue("acronym")}
                onChange={(e) => handleChange("acronym", e.target.value)}
                required
                icon="building"
              />
            </MDBCol>
            <hr />
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
          {/* branch address */}
          <MDBRow>
            <MDBCol md="4">
              <select
                value={handleObjValue("address", "region")}
                className="browser-default custom-select"
                onChange={(e) =>
                  handleObjChange("address", "region", e.target.value)
                }
              >
                <option>Select Region</option>
                {Philippines.Regions.map(({ name }) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </MDBCol>
            <MDBCol md="4">
              <select
                value={handleObjValue("address", "province")}
                className="browser-default custom-select"
                onChange={(e) =>
                  handleObjChange("address", "province", e.target.value)
                }
              >
                <option>Select Province</option>
                {Philippines.Provinces(handleObjValue("address", "region")).map(
                  ({ name }) => (
                    <option key={name}>{name}</option>
                  )
                )}
              </select>
            </MDBCol>
            <MDBCol md="4">
              <select
                value={handleObjValue("address", "city")}
                className="browser-default custom-select"
                onChange={(e) =>
                  handleObjChange("address", "city", e.target.value)
                }
              >
                <option>Select Province</option>
                {Philippines.Cities(handleObjValue("address", "province")).map(
                  ({ name }) => (
                    <option key={name}>{name}</option>
                  )
                )}
              </select>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="6">
              <select
                value={handleObjValue("address", "barangay")}
                className="browser-default custom-select"
                onChange={(e) =>
                  handleObjChange("address", "barangay", e.target.value)
                }
              >
                <option>Select Barangay</option>
                {Philippines.Barangays(handleObjValue("address", "city")).map(
                  ({ name }) => (
                    <option key={name}>{name}</option>
                  )
                )}
              </select>
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
