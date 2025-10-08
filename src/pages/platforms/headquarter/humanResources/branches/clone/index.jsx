import { useCallback } from "react";
import { MDBModal, MDBModalBody, MDBIcon, MDBModalHeader } from "mdbreact";
import { TOGGLE } from "../../../../../../services/redux/slices/assets/branches";
import { useDispatch, useSelector } from "react-redux";

export default function CloneModal() {
  const { auth, token, activePlatform } = useSelector(({ auth }) => auth),
    { showModal: show } = useSelector(({ branches }) => branches),
    dispatch = useDispatch();

  const toggle = useCallback(() => dispatch(TOGGLE()), [dispatch]);

  return (
    <MDBModal size="lg" isOpen={show} toggle={toggle} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="code-branch" className="mr-2" />
      </MDBModalHeader>
      <MDBModalBody className="mb-0"></MDBModalBody>
    </MDBModal>
  );
}
