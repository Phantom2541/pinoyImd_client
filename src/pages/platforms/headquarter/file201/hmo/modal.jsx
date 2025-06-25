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
  TOGGLE,
  UPDATE,
} from "../../../../../services/redux/slices/assets/companies";
// import { useToasts } from "react-toast-notifications";
import { HMO } from "../../../../../services/fakeDb";

export default function Modal() {
  const { showModal, selected, willUPDATE, isLoading, hmo } = useSelector(
      ({ companies }) => companies
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
    // { addToast } = useToasts(),
    [collections, setCollections] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    if (hmo) {
      const codeList = hmo.map((item) => item.code);
      const filtered = HMO.collections.filter(
        (item) => !codeList.includes(item.code)
      );
      setCollections(filtered);
    }
  }, [hmo, dispatch]);

  useEffect(() => {
    if (selected) {
      setForm(selected);
    }
  }, [selected]);
  // Handle update function

  // Handle create function
  const handleAdd = () => {
    let newHmo = [...hmo, form];

    dispatch(
      UPDATE({
        data: { _id: activePlatform.branch.companyId._id, hmo: newHmo },
        token,
      })
    );
    // Close modal after successful save
    dispatch(TOGGLE());
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd();
  };

  // Handle change sa inputs
  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
      userId: auth._id,
      branchId: activePlatform.branchId,
    });
  };

  // Fix: Return correct form value
  const handleValue = (key) => form[key] ?? "";

  // Handle modal close
  const handleClose = () => dispatch(TOGGLE());

  return (
    <MDBModal isOpen={showModal} toggle={handleClose} backdrop size="md">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willUPDATE ? "Remove" : "Add"} HMO
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          {/* Input fields */}
          <label>HMO</label>
          <select
            className="form-control form-control"
            value={handleValue("code") || ""}
            onChange={(e) => handleChange("code", e.target.value)}
          >
            <option value="">Select</option>
            {collections.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
          <MDBInput
            label="Phone"
            type="number"
            maxLength="11"
            value={handleValue("cp.phone")}
            required
            onChange={(e) => handleChange("cp.phone", e.target.value)}
          />
          <MDBInput
            label="Email"
            type="text"
            value={handleValue("cp.email")}
            required
            onChange={(e) => handleChange("cp.email", e.target.value)}
          />
          <MDBInput
            label="Contact Person"
            type="text"
            value={handleValue("cp.agent")}
            required
            onChange={(e) => handleChange("cp.agent", e.target.value)}
          />
          {/* Submit button */}
          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={isLoading}
              color="info"
              className="mb-2"
              rounded
            >
              {willUPDATE ? "Submit" : "Update"}
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
