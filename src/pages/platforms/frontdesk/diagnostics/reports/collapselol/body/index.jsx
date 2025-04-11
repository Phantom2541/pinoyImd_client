import React from "react";
import { MDBCardBody } from "mdbreact";
import Table from "./table";

export default function TaskBody({ task }) {
  return (
    <MDBCardBody className=" w-100 m-0 p-0">
      <Table menu={task} />
    </MDBCardBody>
  );
}
