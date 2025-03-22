import React, { useState, useEffect } from "react";
import {
  MDBModal,
  MDBModalBody,
  MDBIcon,
  MDBModalHeader,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdbreact";

const _form = {
  name: "",
  companyName: "",
  address: {
    region: "REGION III (CENTRAL LUZON)",
    province: "NUEVA ECIJA",
    city: "GENERAL TINIO (PAPAYA)",
    barangay: "Pias",
  },
};

export default function Modal({ show, toggle, selected }) {
  return (
    <MDBModal size="md" isOpen={show} toggle={toggle} backdrop>
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        <MDBIcon icon="building" className="mr-2" />
        Apply to {selected.name}
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <MDBBtn className="float-right mt-3" rounded color="info">
          Register
        </MDBBtn>
      </MDBModalBody>
    </MDBModal>
  );
}
