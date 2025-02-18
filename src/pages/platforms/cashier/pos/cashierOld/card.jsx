import React from "react";
import { MDBBadge, MDBBtn, MDBBtnGroup, MDBIcon } from "mdbreact";
import {
  fullName,
  getAge,
  getGenderIcon,
  fullAddress,
  mobile,
} from "../../../../../services/utilities";

export default function Card({
  user,
  handleCashRegister,
  handleUpdate,
  handlePatronHistory,
}) {
  const {
      fullName: fullname,
      dob,
      isMale,
      address,
      mobile: _mobile,
      email,
    } = user,
    _address = fullAddress(address, false);

  return (
    <div className="cashier-card">
      <label>{fullName(fullname)}</label>
      <hr className="m-0 mb-2" />
      <MDBBadge className="mr-2">{new Date(dob).toDateString()}</MDBBadge>
      <MDBBadge className="mr-3">{getAge(dob)}</MDBBadge>
      {getGenderIcon(isMale)}
      <p>{_mobile ? mobile(_mobile) : email}</p>
      <p className="line-clamp" title={_address}>
        {_address}
      </p>
      <MDBBtnGroup className="cashier-card-footer w-100">
        <MDBBtn
          onClick={() => handleUpdate(user)}
          className="m-0 "
          size="sm"
          color="primary"
        >
          <MDBIcon icon="pencil-alt" />
        </MDBBtn>
        <MDBBtn
          onClick={() => handlePatronHistory(user)}
          className="m-0 "
          size="sm"
          color="primary"
        >
          <MDBIcon icon="user-injured" />
        </MDBBtn>
        <MDBBtn
          onClick={() => handleCashRegister(user)}
          className="m-0"
          size="sm"
          color="primary"
        >
          <MDBIcon icon="cash-register" />
        </MDBBtn>
      </MDBBtnGroup>
    </div>
  );
}
