import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
} from "mdbreact";
import { TOGGLE } from "../../../../../services/redux/slices/reusable/table";
import { SAVE, UPDATE } from "../../../../../services/redux/slices/commerce/catalog/products";
import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

export default function Modal() {
  const dispatch = useDispatch();
  const { showModal, selected, willCreate, isLoading } = useSelector(({ table }) => table);
  const { token, auth } = useSelector(({ auth }) => auth);
  const [form, setForm] = useState(selected || {});
  const { addToast } = useToasts();

  useEffect(() => {
    if (selected) setForm(selected);
  }, [selected]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) {
      dispatch(SAVE({ data: form, token })).then(() => dispatch(TOGGLE()));
    } else {
      if (isEqual(form, selected)) {
        return addToast("No changes found.", { appearance: "info" });
      }
      dispatch(UPDATE({ data: { ...form, _id: selected._id }, token })).then(() =>
        dispatch(TOGGLE())
      );
    }
  };

  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
      userId: auth._id,
    });
  };

  const handleValue = (key) => form[key] || "";

  return (
    <MDBModal isOpen={showModal} toggle={() => dispatch(TOGGLE())} backdrop size="sm">
      <MDBModalHeader
        toggle={() => dispatch(TOGGLE())}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="box" className="mr-2" />
        {willCreate ? "Create" : "Update"} Product
      </MDBModalHeader>
      <MDBModalBody>
        <form onSubmit={handleSubmit}>
          <MDBInput
            label="Product Name"
            type="text"
            value={handleValue("name")}
            required
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <MDBInput
            label="Price"
            type="number"
            value={handleValue("price")}
            onChange={(e) => handleChange("price", e.target.value)}
          />
          <MDBInput
            label="Category"
            type="text"
            value={handleValue("category")}
            onChange={(e) => handleChange("category", e.target.value)}
          />

          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
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
