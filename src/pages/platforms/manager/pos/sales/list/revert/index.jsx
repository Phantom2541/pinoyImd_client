import React, { useState } from "react";
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
  const { token, formSubmmited, auth } = useSelector(({ auth }) => auth),
    { showRevertModal: show, selected } = useSelector(({ deals }) => deals),
    [password, setPassword] = useState(""),
    [isLocked, setIsLocked] = useState(true),
    dispatch = useDispatch();

  const toggle = () => dispatch(ToggleRevertModal());
  const { customerId } = selected;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      REVERT_SALE({
        data: { user: { _id: auth._id, password }, sale: selected },
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
            noteColor="danger"
            note
            noteTitle="Reauthentication: "
          >
            Required To ensure security, please reauthenticate before reverting
            this sale. Enter your password to confirm your identity and proceed.
          </MDBTypography>
          <MDBInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            icon={isLocked ? "lock" : "unlock"}
            onIconMouseEnter={() => setIsLocked(false)}
            onIconMouseLeave={() => setIsLocked(true)}
          />
          <MDBBtn
            className="float-right"
            rounded
            color="info"
            type="submit"
            disabled={formSubmmited}
          >
            Verify {formSubmmited && <MDBIcon icon="spinner" pulse />}
          </MDBBtn>
        </form>
      </MDBModalBody>
    </MDBModal>
  );
}
