import React from "react";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { useSelector } from "react-redux";
import { PresetImage } from "../../../services/utilities";

export default function Profile() {
  const { auth, isPatient, image } = useSelector(({ auth }) => auth);

  return (
    <MDBDropdown>
      <MDBDropdownToggle nav caret>
        {image ? (
          <img
            src={image}
            className="rounded-circle z-depth-1"
            style={{ width: "35px", height: "35px", marginRight: "10px" }}
            alt=" avatar"
            onError={(e) => (e.target.src = PresetImage(auth.isMale))}
          />
        ) : (
          <MDBIcon icon="user" />
        )}
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
