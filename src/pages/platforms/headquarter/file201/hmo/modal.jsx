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
import { SetActivePlatform } from "../../../../../services/redux/slices/assets/persons/auth";

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
    if (showModal) {
      setForm({});
    }
  }, [showModal]);

  // Handle create function
  const handleAdd = () => {
    let newHmo = [...hmo, form];
    dispatch(
      UPDATE({
        data: { _id: activePlatform.branch.companyId._id, hmo: newHmo },
        token,
      })
    ).then(() => {
      dispatch(SetActivePlatform({ data: newHmo, isHMO: true }));
    });
    // Close modal after successful save
    dispatch(TOGGLE());
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    handleAdd();
  };

  // Handle change sa inputs

  // Fix: Return correct form value

  // Handle modal close
  const handleClose = () => dispatch(TOGGLE());

  const { cp = {}, code } = form;

  return (
    <MDBModal isOpen={showModal} toggle={handleClose} backdrop size="md">
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willUPDATE ? "Add" : "Remove"} HMO
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          {/* Input fields */}
          <label>HMO</label>
          <select
            className="form-control form-control"
            value={code || ""}
            required
            onChange={(e) => setForm({ ...form, code: e.target.value })}
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
            value={cp.phone}
            required
            onChange={(e) =>
              setForm({ ...form, cp: { ...form.cp, phone: e.target.value } })
            }
          />
          <MDBInput
            label="Email"
            type="text"
            value={cp.email}
            required
            onChange={(e) =>
              setForm({ ...form, cp: { ...form.cp, email: e.target.value } })
            }
          />
          <MDBInput
            label="Contact Person"
            type="text"
            value={cp.agent}
            required
            onChange={(e) =>
              setForm({ ...form, cp: { ...form.cp, agent: e.target.value } })
            }
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
