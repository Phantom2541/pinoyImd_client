import React from "react";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { useSelector } from "react-redux";

export default function Profile() {
  const { auth, isPatient } = useSelector(({ auth }) => auth);

  return (
    <MDBDropdown>
      <MDBDropdownToggle nav caret>
        <MDBIcon icon="user" />
        &nbsp;
        <span className="d-none d-md-inline">Profile</span>
      </MDBDropdownToggle>
      <MDBDropdownMenu right style={{ minWidth: "200px" }}>
        {!isPatient && (
          <MDBDropdownItem disabled={!auth._id} href="/profile">
            My Account
          </MDBDropdownItem>
        )}
        <MDBDropdownItem
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Log Out
        </MDBDropdownItem>
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
