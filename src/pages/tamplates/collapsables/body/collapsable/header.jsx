import React from "react";
// import { MDBIcon, MDBView, MDBBtn } from "mdbreact";

const Header = ({ service, index, activeId }) => {
  const { name, abbreviation, template } = service;
  return (
    <label className="d-flex justify-content-between">
      {index + 1}. {name} {abbreviation}
      <small>
        {template}
        <i
          style={{ rotate: `${activeId === index ? 0 : 90}deg` }}
          className="fa fa-angle-down transition-all ml-2"
        />
      </small>
    </label>
  );
};

export default Header;
