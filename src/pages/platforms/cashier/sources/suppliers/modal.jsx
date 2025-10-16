import { useCallback, useEffect, useState } from "react";
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
  UPDATE,
  TOGGLE,
} from "../../../../../services/redux/slices/assets/providers";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import Spinner from "../../../../../components/spinner";

export default function Modal() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { showModal, selected, willCreate, isSuccess, formSubmitted } = useSelector(
      ({ providers }) => providers
    ),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const toggle = useCallback(() => dispatch(TOGGLE()), [dispatch]);

  useEffect(() => {
    if (!formSubmitted && isSuccess && showModal) {
      toggle();
    }
  }, [formSubmitted, isSuccess, showModal, toggle]);

  //Listener
  useEffect(() => {
    if (showModal) {
      setForm({
        ...selected,
        userId: auth._id,
        clients: activePlatform.branchId,
        category: "supplier",
      });
    }
  }, [showModal, selected, auth, activePlatform]);

  // Handle update function
  const handleUpdate = () => {
    // Check if object has changed
    if (isEqual(form, selected)) {
      return addToast("No changes found, skipping update.", {
        appearance: "info",
      });
    }

    dispatch(
      UPDATE({
        data: { ...form, _id: selected._id },
        token,
      })
    );
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
    willCreate ? handleCreate() : handleUpdate();
  };

  // Handle change sa inputs
  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  return (
    <MDBModal
      isOpen={showModal}
      toggle={toggle}
      backdrop
      size="sm"
      disableFocusTrap={false}
    >
      <MDBModalHeader
        toggle={() => toggle()}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} Supplier
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBTypography
            tag="h4"
            variant="h4-responsive"
            className="text-center"
          ></MDBTypography>
          <MDBInput
            label="Name"
            value={form?.displayname}
            required
            onChange={(e) => handleChange("displayname", e.target.value)}
          />
          <MDBInput
            label="Abbreviation"
            value={form?.abbr}
            required
            onChange={(e) => handleChange("abbr", e.target.value)}
          />
          <MDBInput
            label="Number"
            value={form?.number}
            onChange={(e) => handleChange("number", e.target.value)}
          />
          <MDBInput
            label="address"
            value={form?.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
          <label
            style={{
              display: "block",
              marginBottom: "0.25rem",
              fontSize: "0.8rem",
            }}
          >
            Status
          </label>
          <select
            value={form?.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="denied">Denied</option>
          </select>

          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={formSubmitted}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "Submit" : "Update"}
              <Spinner formSubmitted={formSubmitted} />
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
