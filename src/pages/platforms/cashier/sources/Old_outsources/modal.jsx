import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "mdbreact";
import { SetEDIT } from "../../../../../services/redux/slices/assets/providers";

const EditModal = () => {
  const dispatch = useDispatch();
  const { showModal, selected } = useSelector(({ providers }) => providers);

  const closeModal = () => dispatch(SetEDIT({}));

  return (
    <Modal isOpen={showModal} toggle={closeModal} backdrop={false}>
      <ModalHeader>Edit Vendor</ModalHeader>
      <ModalBody>
        <p>Editing: {selected?.displayname || selected?.name}</p>
        {/* Add form fields here */}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button color="primary">Save Changes</Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditModal;
