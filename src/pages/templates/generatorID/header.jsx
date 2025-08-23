import React from "react";
import { MDBBtn } from "mdbreact";

export default function Header({ setIsModalOpen }) {
  return (
    <div className="IDGenerator-header">
      <h1>Generate ID</h1>
      <div>
        <MDBBtn color="primary" onClick={() => setIsModalOpen(true)}>
          Add Template
        </MDBBtn>
      </div>
    </div>
  );
}
