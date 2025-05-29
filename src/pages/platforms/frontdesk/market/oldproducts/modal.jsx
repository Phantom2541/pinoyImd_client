import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalFooter,
  MDBModalHeader,
} from "mdbreact";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { TOGGLE } from "../../../../../services/redux/slices/market/products";

export default function ModalProduct() {
  const { show } = useSelector(({ products }) => products),
    dispatch = useDispatch();

  const toggle = () => {
    dispatch(TOGGLE());
  };

  return (
    <MDBModal isOpen={show} onClose={toggle} backdrop className="">
      <MDBModalBody>
        <MDBModalHeader>Modal title</MDBModalHeader>
        <MDBModalBody>...</MDBModalBody>

        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={toggle}>
            Close
          </MDBBtn>
          <MDBBtn>Save changes</MDBBtn>
        </MDBModalFooter>
      </MDBModalBody>
    </MDBModal>
  );
}
