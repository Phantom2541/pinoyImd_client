import React from "react";
import { Statements } from "../../../../../../../services/fakeDb";
import {
  currency,
  fullName,
  dateFormat,
} from "../../../../../../../services/utilities";
// import { MDBIcon, MDBView, MDBBtn } from "mdbreact";

const Header = ({ payment, index, activeId }) => {
  const { liabilityId, amount, fsId, remarks, createdAt } = payment;
  // console.log("particular", particular);
  return (
    <label className="d-flex justify-content-between">
      {index + 1}. {fullName(liabilityId?.particular?.fullName)}{" "}
      {Statements.getName(fsId)}- {dateFormat(createdAt)}
      <span>{remarks}</span>
      <small>
        {currency(amount)}
        {fsId === 13 && (
          <span
            style={{ rotate: `${activeId === index ? 0 : 90}deg` }}
            className="fa fa-angle-down transition-all ml-2"
          />
        )}
      </small>
    </label>
  );
};

export default Header;
