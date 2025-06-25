import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBModal, MDBModalBody, MDBIcon, MDBModalHeader } from "mdbreact";
import {
  TOGGLE,
  SAVE,
  UPDATE,
} from "../../../../../../services/redux/slices/market/generics";

import { isEqual } from "lodash";
import { useToasts } from "react-toast-notifications";

export default function Modal() {
  const { showRequirementsModal, selected, willCreate } = useSelector(
      ({ applicants }) => applicants
    ),
    { token, auth, activePlatform } = useSelector(({ auth }) => auth),
    [form, setForm] = useState(selected),
    { addToast } = useToasts(),
    dispatch = useDispatch();

  // Sync form state with selected when modal opens
  useEffect(() => {
    if (selected) {
      setForm(selected);
    }
  }, [selected]);

  // Handle modal close
  const handleClose = () => dispatch(TOGGLE());

  return (
    <MDBModal
      isOpen={showRequirementsModal}
      toggle={handleClose}
      backdrop
      size="md"
    >
      <MDBModalHeader
        toggle={handleClose}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="user" className="mr-2" />
        {willCreate ? "Create" : "Update"} Generics
      </MDBModalHeader>
      <MDBModalBody className="mb-0"></MDBModalBody>
    </MDBModal>
  );
}
