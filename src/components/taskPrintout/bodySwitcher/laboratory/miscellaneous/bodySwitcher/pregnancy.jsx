import React from "react";
import { MDBCol } from "mdbreact";

export default function Pregnancy({ task, fontSize }) {
  const { results, packages } = task;
  return (
    <div
      className="pl-5 mt-5 mb-5 offset-md-2"
      style={{ fontSize: `${fontSize}rem` }}
    >
      <MDBCol>
        {packages.includes(67) && "PREGNANCY "}
        {packages.includes(84) && "Fecal Occult Blood "}
        TEST:&nbsp;
        <b style={{ color: results ? "red" : "black" }}>
          {results ? "POSITIVE" : "NEGATIVE"}
        </b>
      </MDBCol>
    </div>
  );
}
