import { useDispatch, useSelector } from "react-redux";
import { MDBModal, MDBModalBody, MDBIcon, MDBModalHeader } from "mdbreact";
import { TOGGLE } from "../../../../../../../services/redux/slices/market/generics";

export default function Modal() {
  const { showRequirementsModal, willCreate } = useSelector(
      ({ applicants }) => applicants
    ),
    dispatch = useDispatch();

  // Sync form state with selected when modal opens

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
