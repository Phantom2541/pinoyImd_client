import React, { useState, useEffect } from "react";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { useSelector } from "react-redux";
import { PresetImage, clearSiteData } from "../../../services/utilities";

export default function Profile() {
  const { auth, isPatient, image, activePlatform } = useSelector(
      ({ auth }) => auth
    ),
    [platform, setPlatform] = useState("patron");

  useEffect(() => {
    setPlatform(activePlatform?.platform);
  }, [activePlatform]);

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
        {platform && (
          <MDBDropdownItem href={`/${platform?.toLowerCase()}/profile`}>
            My Account
          </MDBDropdownItem>
        )}
        {!isPatient && (
          <MDBDropdownItem
            disabled={!auth._id}
            href={`/${platform?.toLowerCase()}/contract`}
            title="i show dito ang contract sa active branch, need kasi malaman if LAB or RAD or Clinic"
          >
            Contract
          </MDBDropdownItem>
        )}
        <MDBDropdownItem
          onClick={() => {
            clearSiteData();
            // localStorage.clear();
            window.location.href = "/";
          }}
        >
          Log Out
        </MDBDropdownItem>
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
