import React from "react";
import { MDBContainer } from "mdbreact";
import { useSelector } from "react-redux";
import { capitalize } from "../../services/utilities";

export default function NotExisting() {
  const { activePlatform } = useSelector(({ auth }) => auth);

  return (
    <MDBContainer className="text-center">
      <h1>Error 400</h1>

      <h4 className="mt-3">
        [{capitalize(activePlatform?.platform)}] - {window.location.pathname}
      </h4>

      <p>
        This page does not have a component yet, Dont forget to setup your
        sidebar components.
      </p>
    </MDBContainer>
  );
}
