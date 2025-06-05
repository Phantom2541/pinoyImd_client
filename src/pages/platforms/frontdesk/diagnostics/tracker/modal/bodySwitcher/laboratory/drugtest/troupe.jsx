import React from "react";
import { MDBInput } from "mdbreact";

export default function Troupe({ task, setTask, handleSelectChange }) {
  const { method, purpose, company } = task;

  return (
    <>
      <MDBInput
        type="text"
        label="Test Method"
        value={method}
        onChange={(e) => handleSelectChange("method", e.target.value)}
        required
      />
      <MDBInput
        type="text"
        label="Purpose"
        value={purpose}
        onChange={(e) => handleSelectChange("purpose", e.target.value)}
        required
      />
      <MDBInput
        type="text"
        label="Requesting Parties"
        value={company}
        onChange={(e) => handleSelectChange("company", e.target.value)}
        required
      />
    </>
  );
}
