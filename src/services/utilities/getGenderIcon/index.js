import { MDBIcon } from "mdbreact";
import React from "react";

const getGenderIcon = (isMale) => (
  <MDBIcon
    className={`mr-2 text-${isMale ? "primary" : "danger"}`}
    icon={isMale ? "mars" : "venus"}
  />
);

export default getGenderIcon;
