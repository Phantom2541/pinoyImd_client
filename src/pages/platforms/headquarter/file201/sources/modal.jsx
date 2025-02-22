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
  BROWSE,
  RESET,
} from "../../../../../services/redux/slices/assets/branches";
import {
  SAVE,
  UPDATE,
} from "../../../../../services/redux/slices/assets/providers";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

const initialForm = {
  vendors: null,
  clients: null,
  category: [],
  name: "",
  subName: "",
  credit: "",
  discount: "",
  invoice: 0,
  hmo: 0,
  silver: 0,
  gold: 0,
  platinum: 0,
  diamond: 0,
  crown: 0,
  ao: null,
  isApproved: false,
};

export default function Modal({ show, toggle, selected, willCreate }) {
  const dispatch = useDispatch();
  const { addToast } = useToasts();

  const { isLoading, collections: branches } = useSelector(
    ({ branches }) => branches
  );
  const { token } = useSelector(({ auth }) => auth);

  const [form, setForm] = useState(initialForm);
  const [customBranch, setCustomBranch] = useState(false);

  useEffect(() => {
    if (willCreate) dispatch(BROWSE({ token }));
    return () => dispatch(RESET());
  }, [token, willCreate, dispatch]);

  useEffect(() => {
    if (!willCreate && show) {
      setForm(selected || initialForm);
      setCustomBranch(
        selected?.clients &&
          !branches.some((clients) => clients._id === selected.clients)
      );
    }
  }, [willCreate, selected, show, branches]);

  const handleUpdate = () => {
    toggle();
    if (isEqual(form, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }
    dispatch(UPDATE({ data: { ...form, _id: selected._id }, token }));
    setForm(initialForm);
  };

  const handleCreate = () => {
    dispatch(SAVE({ data: form, token }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data before submission:", form);
    willCreate ? handleCreate() : handleUpdate();
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBranchChange = (value) => {
    if (value === "other") {
      setCustomBranch(true);
      setForm((prev) => ({ ...prev, name: "", subName: "", clients: "" }));
    } else {
      setCustomBranch(false);
      setForm((prev) => ({ ...prev, name: value, clients: value }));
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setCustomBranch(false);
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

      <MDBModalBody>
        <form onSubmit={handleSubmit}>
          <MDBRow>
            <MDBCol md="12">
              <label htmlFor="membershipSelect">Membership</label>
              <select
                id="membershipSelect"
                className="form-control"
                onChange={(e) => handleChange("membership", e.target.value)}
                value={form?.membership || ""}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="hmo">hmo</option>
                <option value="silver">silver</option>
                <option value="gold">gold</option>
                <option value="platinum">platinum</option>
                <option value="diamond">diamond</option>
                <option value="crown">crown</option>
              </select>
            </MDBCol>
          </MDBRow>

          <br />

          {!customBranch && (
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="branchSelect">Company</label>
                <select
                  id="branchSelect"
                  className="form-control"
                  onChange={(e) => handleBranchChange(e.target.value)}
                  value={form?.companyName || ""}
                >
                  <option value="" disabled>
                    Select a Company
                  </option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.companyName}
                    </option>
                  ))}
                </select>
              </MDBCol>
            </MDBRow>
          )}
          <br />
          {!customBranch && (
            <MDBRow>
              <MDBCol md="12">
                <label htmlFor="branchSelect">Branch</label>
                <select
                  id="branchSelect"
                  className="form-control"
                  onChange={(e) => handleBranchChange(e.target.value)}
                  value={form?.name || ""}
                >
                  <option value="" disabled>
                    Select a branch
                  </option>
                  {branches.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name}
                    </option>
                  ))}
                  <option value="other">Unregistered</option>
                </select>
              </MDBCol>
            </MDBRow>
          )}

          {customBranch && (
            <MDBRow className="mt-2">
              <MDBCol md="6">
                <MDBInput
                  label="Enter Name"
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </MDBCol>
              <MDBCol md="6">
                <MDBInput
                  label="Enter Subname"
                  type="text"
                  value={form.subName}
                  onChange={(e) => handleChange("subName", e.target.value)}
                  required
                />
              </MDBCol>
            </MDBRow>
          )}

          <br />

          <MDBRow>
            <MDBCol md="12">
              <label htmlFor="categorySelect">Category</label>
              <select
                id="categorySelect"
                className="form-control"
                onChange={(e) => handleChange("category", e.target.value)}
                value={form?.category || ""}
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="supplier">supplier</option>
                <option value="outsource">outsource</option>
                <option value="insource">insource</option>
                <option value="Utilities">Utilities</option>
              </select>
            </MDBCol>
          </MDBRow>

          <div className="text-center mt-3">
            <MDBBtn type="submit" disabled={isLoading} color="info" rounded>
              {willCreate ? "Submit" : "Update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
