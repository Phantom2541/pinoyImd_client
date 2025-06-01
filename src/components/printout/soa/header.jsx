import React from "react";
import { billingAddress, currency } from "../../../services/utilities";

const Header = ({ range, vendor, total }) => {
  return (
    <div>
      <div
        className="d-flex align-items-center justify-content-between "
        style={{ borderTop: "1px solid black" }}
      >
        <div className="d-flex align-items-center mt-1">
          <h6 className="fw-bold">Name: </h6>
          <h6 className="ml-1">{`${
            vendor?.companyId?.name?.toUpperCase() || ""
          } ${vendor?.name?.toUpperCase()}`}</h6>
        </div>
        <div className="d-flex align-items-center mt-1">
          <h6 className="fw-bold">From: </h6>
          <h6 className="ml-1">{range}</h6>
        </div>
      </div>
      <div
        className="d-flex align-items-center justify-content-between "
        style={{ borderTop: "1px solid black" }}
      >
        <div className="d-flex align-items-center mt-1">
          <h6 className="fw-bold">Address: </h6>
          <h6 className="ml-1">{billingAddress(vendor?.address)}</h6>
        </div>
        <div className="d-flex align-items-center mt-1">
          <h6 className="fw-bold">Gross: </h6>
          <h6 className="ml-1">{currency(total)}</h6>
        </div>
      </div>
    </div>
  );
};

export default Header;
