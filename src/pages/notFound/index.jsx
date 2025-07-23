import React from "react";
import { MDBContainer } from "mdbreact";

export default function NotFound() {
  return (
    <MDBContainer className="text-center">
      <h1>404</h1>

      <h4 className="mt-3">{window.location.pathname}</h4>

      <p>
        This page is either ongoing development or does not exist, please do not
        tamper with the url links.
      </p>
    </MDBContainer>
  );
}
