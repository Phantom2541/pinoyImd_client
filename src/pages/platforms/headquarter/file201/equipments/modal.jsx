import React, { useState } from "react";
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
} from "../../../../../services/redux/slices/assets/procurements";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import CustomSelect from "../../../../../components/customSelect";

// declare your expected items
const _form = {
  model: "",
  brand: "",
  serial: "",
  mortgage: "",
  accuqired: "",
  status: "",
  category: "",
  price: "",
};

var status = [
  {
    name: "Fully Functional",
    value: "fully functional",
  },
  {
    name: "Functional",
    value: "functional",
  },
  {
    name: "Damaged",
    value: "damaged",
  },
  {
    name: "Broken",
    value: "broken",
  },
];

var accuqired = [
  {
    name: "Brand New",
    value: "brand-new",
  },
  {
    name: "Refurbish",
    value: "refurbish",
  },
];

var category = [
  {
    name: "Furniture",
    value: "furniture",
  },
  {
    name: "Machines",
    value: "machines",
  },
];

export default function Modal({ show, toggle, selected, willCreate }) {
  const { isLoading } = useSelector(({ personnels }) => personnels),
    { token, activePlatform, auth } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(_form),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const handleUpdate = () => {
    toggle();

    // check if object has changed
    if (isEqual(form, selected))
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    const data = {
      model: form.model ? form.model : selected.model,
      brand: form.brand ? form.brand : selected.brand,
      serial: form.serial ? form.serial : selected.serial,
      mortgage: form.mortgage ? form.mortgage : selected.mortgage,
      accuqired: form.accuqired ? form.accuqired : selected.accuqired,
      status: form.status ? form.status : selected.status,
      category: form.category ? form.category : selected.category,
      price: form.price ? form.price : selected.price,
    };

    dispatch(
      UPDATE({
        data: { ...data, id: selected._id },
        token,
      })
    );

    setForm(_form);
  };

  const handleCreate = () => {
    dispatch(
      SAVE({
        data: { ...form, user: auth._id, branchId: activePlatform?.branchId },
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

  const handleStatusChange = (value) => {
    setForm((prev) => ({ ...prev, status: value }));
  };
  const handleCategoryChange = (value) => {
    setForm((prev) => ({ ...prev, category: value }));
  };
  const handleAccuqiredChange = (value) => {
    setForm((prev) => ({ ...prev, accuqired: value }));
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
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} {selected.name || "a Equipments"}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                type="text"
                label="Brand"
                value={handleValue("brand")}
                onChange={(e) => handleChange("brand", e.target.value)}
                required
                icon="code-branch"
              />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                type="text"
                label="Model"
                value={handleValue("model")}
                onChange={(e) => handleChange("model", e.target.value)}
                required
                icon="id-card-alt"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                type="text"
                label="Serial"
                value={handleValue("serial")}
                onChange={(e) => handleChange("serial", e.target.value)}
                required
                icon="eraser"
              />
            </MDBCol>
            <MDBCol md="6">
              <MDBInput
                type="number"
                label="Mortgage"
                value={handleValue("mortgage")}
                onChange={(e) => handleChange("mortgage", e.target.value)}
                required
                icon="clipboard-check"
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="6">
              <MDBInput
                type="number"
                label="Price"
                value={handleValue("price")}
                onChange={(e) => handleChange("price", e.target.value)}
                required
                icon="dollar-sign"
              />
            </MDBCol>
            <MDBCol md="6">
              <CustomSelect
                choices={status}
                onChange={handleStatusChange}
                label={"Status"}
                texts="name"
                values="value"
                preValue={selected.status ? selected.status : ""}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol md="6">
              <CustomSelect
                onChange={handleAccuqiredChange}
                label={"Accuqired"}
                choices={accuqired}
                texts="name"
                values="value"
                preValue={selected.accuqired ? selected.accuqired : ""}
              />
            </MDBCol>{" "}
            <MDBCol md="6">
              <CustomSelect
                label={"Category"}
                onChange={handleCategoryChange}
                choices={category}
                texts="name"
                values="value"
                preValue={selected.category ? selected.category : ""}
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
