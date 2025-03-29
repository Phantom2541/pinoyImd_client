import React from "react";
import { MDBModal, MDBModalBody, MDBModalHeader } from "mdbreact";
import Table from "./table";

export default function Modal({ show, toggle }) {
  return (
    <MDBModal
      isOpen={show}
      toggle={toggle}
      backdrop
      disableFocusTrap={false}
      size="fluid"
    >
      <MDBModalHeader
        toggle={toggle}
        className="light-blue darken-3 white-text"
      >
        Census
      </MDBModalHeader>
      <MDBModalBody className="mb-0">
        <div style={{ display: "flex", gap: "5px" }}>
          <Table name="menus" />
          <Table name="services" />
        </div>
      </MDBModalBody>
    </MDBModal>
  );
}
