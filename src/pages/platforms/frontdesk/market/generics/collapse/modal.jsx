import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBTypography,
  MDBCol,
  MDBRow,
} from "mdbreact";
import {
  SAVE,
  TOGGLE,
  UPDATE,
} from "../../../../../../services/redux/slices/market/medicines";
import {
  // SAVE as GenSAVE,
  // UPDATE as GenUPDATE,
  SetBrands,
} from "../../../../../../services/redux/slices/market/generics";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

export default function Modal() {
  const { showModal, Genselected, selected, willCreate, isLoading } =
      useSelector(({ medicines }) => medicines),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  useEffect(() => {
    selected && setForm(selected);
  }, [selected]);
  // Handle update function
  const handleUpdate = () => {
    dispatch(TOGGLE());

    if (isEqual(form, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    // console.log("form", form);
    // console.log("genselected", Genselected);

    dispatch(
      UPDATE({
        data: { ...form, _id: selected._id },
        token,
      })
    ).then(({ payload }) => {
      const newBrand = payload.payload; // new or updated brand
      const existingIndex = Genselected.brands.findIndex(
        (brand) => brand._id === newBrand._id
      );

      let updatedBrands;

      if (existingIndex === -1) {
        // ✅ Add if it doesn't exist
        updatedBrands = [...Genselected.brands, newBrand];
      } else {
        // 🔄 Update if it already exists
        updatedBrands = [...Genselected.brands];
        updatedBrands[existingIndex] = newBrand;
      }

      const updatedGeneric = {
        ...Genselected,
        brands: updatedBrands,
      };

      dispatch(SetBrands(updatedGeneric));
      console.log("Updated Generic:", updatedGeneric);
    });
  };

  // Handle create function
  const handleCreate = () => {
    dispatch(
      SAVE({
        data: form,
        token,
      })
    ).then(() => TOGGLE()); // Close modal after successful save
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) return handleCreate();
    handleUpdate();
  };

  // Handle change sa inputs
  const handleChange = (key, value) => {
    const keys = key.split(".");
    if (keys.length === 1) {
      setForm({
        ...form,
        [key]: value,
        userId: auth._id,
        branchId: activePlatform.branchId,
      });
    } else {
      const [parent, child] = keys;
      // console.log(parent, child);
      // console.log("form[parent]", form[parent]);
      // console.log("value", value);

      setForm({
        ...form,
        [parent]: {
          ...form[parent],
          [child]: value,
        },
        userId: auth._id,
        branchId: activePlatform.branchId,
      });
    }

    // console.log("form", form);
  };

  // Fix: Return correct form value
  const handleValue = (key) => {
    const keys = key.split(".");
    let value = form;

    for (let k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return ""; // return empty if not found
      }
    }

    return value ?? "";
  };

  // Handle modal close
  const handleClose = () => dispatch(TOGGLE());

  return (
    <MDBModal isOpen={showModal} toggle={handleClose} backdrop size="md">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} Medicines
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBTypography
            tag="h4"
            variant="h4-responsive"
            className="text-center"
          ></MDBTypography>

          {/* Input fields */}
          <MDBInput
            label="Form"
            type="text"
            value={handleValue("subname")}
            required
            onChange={(e) => handleChange("subname", e.target.value)}
          />
          <label className="small">Pack</label>
          <MDBRow className="no-gap p-0 d-flex align-items-center">
            <MDBCol md="5">
              <MDBInput
                type="Number"
                label="Volume"
                value={handleValue("pack.v")}
                required
                onChange={(e) => handleChange("pack.v", e.target.value)}
              />
            </MDBCol>
            <MDBCol md="5">
              <MDBInput
                type="text"
                label="Units"
                value={handleValue("pack.u")}
                required
                onChange={(e) => handleChange("pack.u", e.target.value)}
              />
            </MDBCol>
          </MDBRow>
          <MDBRow className="no-gap p-0 d-flex align-items-center">
            <MDBCol md="5">
              <MDBInput
                type="Number"
                label="Quantity"
                value={handleValue("pack.q")}
                required
                onChange={(e) => handleChange("pack.q", e.target.value)}
              />
            </MDBCol>
            <MDBCol md="5">
              <MDBInput
                type="text"
                label="Boxes"
                value={handleValue("pack.b")}
                required
                onChange={(e) => handleChange("pack.b", e.target.value)}
              />
            </MDBCol>
          </MDBRow>
          <label>Size</label>
          <select
            className="form-control form-control"
            value={handleValue("packages.size") || ""}
            onChange={(e) => handleChange("packages.size", e.target.value)}
          >
            <option disabled value="">
              Options
            </option>
            <option value="sm">Small</option>
            <option value="md">Medium</option>
            <option value="ld">Large</option>
            <option value="xl">Extra Large</option>
            <option value="xx">2 Extra Large</option>
          </select>
          <MDBInput
            label="Purpose"
            type="text"
            value={handleValue("purpose")}
            required
            onChange={(e) => handleChange("purpose", e.target.value)}
          />
          <label>Status</label>
          <select
            className="form-control form-control"
            value={handleValue("status") || ""}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option disabled value="">
              Options
            </option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="halt">Halt</option>
            <option value="banned">Banned</option>
          </select>
          {/* Submit button */}
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
