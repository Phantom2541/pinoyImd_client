import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  MDBDropdown,
  MDBDropdownItem,
  MDBDropdownMenu,
  MDBDropdownToggle,
} from "mdbreact";
import VerificationCode from "./verify";
import { useToasts } from "react-toast-notifications";
import ChangePassword from "./changePassword";

export default function ProfileOthers() {
  const { isLoading, auth } = useSelector(({ auth }) => auth),
    { addToast } = useToasts(),
    [verify, setVerify] = useState(false),
    [changePass, setChangePass] = useState(false);

  return (
    <>
      <MDBDropdown dropright disabled={isLoading}>
        <MDBDropdownToggle>Others</MDBDropdownToggle>
        <MDBDropdownMenu>
          <MDBDropdownItem onClick={() => setChangePass(true)}>
            Change Password
          </MDBDropdownItem>
          {!auth.verified && (
            <MDBDropdownItem
              onClick={() =>
                addToast("Soon to be added.", { appearance: "info" })
              }
              //   onClick={() => setVerify(true)}
            >
              Verify Account
            </MDBDropdownItem>
          )}
        </MDBDropdownMenu>
      </MDBDropdown>
      <VerificationCode show={verify} toggle={() => setVerify(false)} />
      <ChangePassword show={changePass} toggle={() => setChangePass(false)} />
    </>
  );
}
