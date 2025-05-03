import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBInput,
  MDBTypography,
} from "mdbreact";
import {
  REVERT_SALE,
  ToggleRevertModal,
} from "../../../../../../../services/redux/slices/commerce/pos/services/deals";
import { fullName } from "../../../../../../../services/utilities";

export default function RevertSale() {
  const dispatch = useDispatch();
  const { token, auth } = useSelector(({ auth }) => auth);
  const {
    showRevertModal: show,
    selected,
    formSubmitted,
    message = "",
  } = useSelector(({ deals }) => deals);

  const [password, setPassword] = useState("");
  const [isLocked, setIsLocked] = useState(true);
  const [haveMessage, setHaveMessage] = useState(false);

  const toggle = useCallback(() => {
    dispatch(ToggleRevertModal());
  }, [dispatch]);

  useEffect(() => {
    if (show) {
      setHaveMessage(false);
      setPassword("");
    }
  }, [show]);

  useEffect(() => {
    if (message) {
      setHaveMessage(true);
    }
  }, [message]);

  const { customerId } = selected;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      REVERT_SALE({
        data: { user: { _id: auth._id, password }, saleID: selected._id },
        token,
      })
    );
  };

  return (
    <MDBModal isOpen={show} toggle={toggle} backdrop disableFocusTrap={false}>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="sync-alt" className="mr-2" />
        {fullName(customerId?.fullName)}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <form onSubmit={handleSubmit}>
          <MDBTypography
            variant="h2"
            noteColor="warning"
            note
            noteTitle="Reauthentication: "
          >
            Required. To ensure security, please reauthenticate before reverting
            this sale. Enter your password to confirm your identity and proceed.
          </MDBTypography>

          <MDBInput
            label="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            type={isLocked ? "password" : "text"}
            icon={isLocked ? "lock" : "unlock"}
            onIconMouseEnter={() => setIsLocked(false)}
            onIconMouseLeave={() => setIsLocked(true)}
          />

          {haveMessage && (
            <MDBTypography
              variant="h2"
              noteColor="danger"
              note
              noteTitle="Incorrect password: "
            >
              For security reasons, please verify your credentials carefully.
            </MDBTypography>
          )}

          <MDBBtn
            className="float-right"
            rounded
            color="info"
            type="submit"
            disabled={formSubmitted}
          >
            Verify {formSubmitted && <MDBIcon icon="spinner" pulse />}
          </MDBBtn>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
