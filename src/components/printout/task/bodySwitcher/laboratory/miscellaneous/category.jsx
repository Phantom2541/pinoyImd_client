import React from "react";
import { MDBCol } from "mdbreact";

export default function Category({ task }) {
  const { specimen } = task;
  //console.log(task);
  return (
    <MDBCol
      size="12"
      className="ml-5"
      style={{
        marginLeft: 20,
        fontSize: "20px",
      }}
    >
      <b> {specimen} </b> OGTT
    </MDBCol>
  );
}
