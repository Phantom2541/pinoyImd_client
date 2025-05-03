import React from "react";
import { Statements } from "../../../../../../../services/fakeDb";
import { fullName } from "../../../../../../../services/utilities";
// import { MDBIcon, MDBView, MDBBtn } from "mdbreact";

const Header = ({ payment, index, activeId }) => {
  const { liabilityId, amount, fsId } = payment;
  // console.log("particular", particular);
  return (
    <label className="d-flex justify-content-between">
      {index + 1}. {fullName(liabilityId?.particular?.fullName)}{" "}
      {Statements.getName(fsId)} {amount}
      <small>
        {amount}
        <span
          style={{ rotate: `${activeId === index ? 0 : 90}deg` }}
          className="fa fa-angle-down transition-all ml-2"
        />
      </small>
    </label>
  );
};

export default Header;
