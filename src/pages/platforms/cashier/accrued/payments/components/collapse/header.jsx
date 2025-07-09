import React from "react";
import { currency } from "../../../../../../../services/utilities";
// import { MDBIcon, MDBView, MDBBtn } from "mdbreact";

const Header = ({ title, index, activeId, count, isOpen, sum }) => {
  // console.log("particular", particular);
  return (
    <label className="d-flex justify-content-between">
      {index + 1}. {title}
      <small>
        {currency.format(sum)}
        <span
          style={{ rotate: `${activeId === index ? 0 : 90}deg` }}
          className="fa fa-angle-down transition-all ml-2"
        />
      </small>
    </label>
  );
};

export default Header;
