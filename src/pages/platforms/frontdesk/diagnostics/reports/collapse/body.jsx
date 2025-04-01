import React from "react";
import { MDBCardBody } from "mdbreact";
import Table from "./table";

export default function TaskBody({ task }) {
  return (
    <MDBCardBody className="pt-0">
      <Table menu={task} />
    </MDBCardBody>
  );
}

