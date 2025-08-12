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
  const { showModal = false, selected = null, willCreate = false, isLoading = false } =
    useSelector((s) => s.table || {});

  const { token, auth } = useSelector((s) => s.auth || {});
  const [form, setForm] = useState(selected || {});
  const { addToast } = useToasts();

  // keep form in sync when selected changes
  useEffect(() => {
    setForm(selected || {});
  }, [selected]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (willCreate) {
      dispatch(SAVE({ data: form, token }))
        .unwrap?.()
        .then(() => {
          dispatch(TOGGLE());
          addToast("Created successfully", { appearance: "success" });
        })
        .catch((err) => {
          addToast("Create failed: " + (err?.message || ""), { appearance: "error" });
        });
    } else {
      if (!selected) return addToast("No item selected", { appearance: "info" });
      if (isEqual(form, selected)) {
        return addToast("No changes found.", { appearance: "info" });
      }
      dispatch(UPDATE({ data: { ...form, _id: selected._id }, token }))
        .unwrap?.()
        .then(() => {
          dispatch(TOGGLE());
          addToast("Updated successfully", { appearance: "success" });
        })
        .catch((err) => {
          addToast("Update failed: " + (err?.message || ""), { appearance: "error" });
        });
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value, userId: auth?._id }));
  };

  const handleValue = (key) => (form && form[key]) || "";

  return (
    <MDBModal isOpen={!!showModal} toggle={() => dispatch(TOGGLE())} backdrop size="sm">
      <MDBModalHeader toggle={() => dispatch(TOGGLE())} className="light-blue darken-3 white-text">
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
            label="Unit Cost"
            type="number"
            value={handleValue("unitCost")}
            onChange={(e) => handleChange("unitCost", e.target.value)}
          />
          <MDBInput
            label="Stock Total"
            type="number"
            value={handleValue("stockTotal")}
            onChange={(e) => handleChange("stockTotal", e.target.value)}
          />
          <MDBInput
            label="Remarks"
            type="text"
            value={handleValue("remarks")}
            onChange={(e) => handleChange("remarks", e.target.value)}
          />

          <div className="text-center mb-1-half">
            <MDBBtn type="submit" disabled={isLoading} color="info" rounded>
              {willCreate ? "Submit" : "Update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
