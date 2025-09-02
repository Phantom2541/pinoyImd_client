import { useCallback, useEffect, useState } from "react";
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
  SAVE,
  UPDATE,
  TOGGLE,
} from "../../../../../../services/redux/slices/assets/providers";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";
import { removeUndefinedValues } from "../../../../../../services/utilities";
import Spinner from "../../../../../../components/spinner";

export default function Modal() {
  const { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    { showModal, selected, willCreate, formSubmitted, isSuccess } = useSelector(
      ({ providers }) => providers
    ),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  const toggle = useCallback(() => {
    dispatch(TOGGLE());
  }, [dispatch]);

  useEffect(() => {
    if (showModal) {
      setForm({
        ...selected,
      });
    }
  }, [showModal, selected, auth, activePlatform]);

  useEffect(() => {
    if (!formSubmitted && isSuccess && showModal) toggle();
  }, [toggle, showModal, formSubmitted, isSuccess]);

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
        data: { ...form },
        token,
      })
    );
  };

  // Handle create function
  const handleCreate = () => {
    dispatch(
      SAVE({
        data: {
          ...form,
          userId: auth._id,
          clients: activePlatform.branchId,
          category: "hotline",
        },
        token,
      })
    );
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setForm(removeUndefinedValues(form));
    willCreate ? handleCreate() : handleUpdate();
  };

  // Handle change sa inputs
  const handleChange = (key, value) =>
    setForm({
      ...form,
      [key]: value,
    });

  return (
    <MDBModal isOpen={showModal} toggle={toggle} backdrop size="sm">
      <MDBModalHeader
        toggle={() => toggle()}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} Hotline
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          {/* Input fields */}
          <MDBInput
            label="Name"
            value={form?.displayname}
            required
            onChange={({ target }) => handleChange("displayname", target.value)}
          />
          <MDBInput
            label="Abbreviation"
            value={form?.abbr}
            required
            onChange={({ target }) => handleChange("abbr", target.value)}
          />

          <MDBInput
            label="Address"
            value={form?.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
          <MDBInput
            label="Phone Number"
            value={form?.number}
            onChange={(e) => handleChange("number", e.target.value)}
          />

          {/* Submit button */}
          <div className="text-center mb-1-half">
            <MDBBtn
              type="submit"
              disabled={formSubmitted}
              color="info"
              className="mb-2"
              rounded
            >
              {willCreate ? "Submit" : "Update"}{" "}
              <Spinner formSubmitted={formSubmitted} />
            </MDBBtn>
          </div>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
