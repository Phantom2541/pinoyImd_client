import React from "react";
import {
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBIcon,
  MDBBadge,
} from "mdbreact";
import { useSelector } from "react-redux";
import Platforms from "./platforms";
import Profile from "./profile";
import Branches from "./branches";
import { capitalize } from "../../services/utilities";
import DTR from "./dtr";

export default function TopNavigation({ toggle, onSideNavToggleClick }) {
  const { activePlatform, auth } = useSelector((state) => state.auth);
  const { access, department } = activePlatform;
  const aka = auth?.alias || auth?.fullName?.fname;

  const navStyle = {
    paddingLeft: toggle ? "16px" : "240px",
    transition: "padding-left .3s",
  };

  return (
    <MDBNavbar
      className="flexible-MDBNavbar"
      light
      expand="md"
      scrolling
      fixed="top"
      style={{ zIndex: 3, minWidth: 500 }}
    >
      <div
        onClick={onSideNavToggleClick}
        style={{
          lineHeight: "32px",
          marginLeft: "1em",
          verticalAlign: "middle",
          cursor: "pointer",
        }}
      >
        <MDBIcon icon="bars" color="white" size="lg" />
      </div>

      <MDBNavbarBrand href="#" style={navStyle}>
        <MDBBadge
          className="py-2 px-3"
          color="warning-color-dark"
          style={{
            fontSize: "1rem",
            fontWeight: 400,
            boxShadow: "0px 0px 0px 0px",
          }}
          pill
        >
          {access.length > 0
            ? `${capitalize(department)} :)`
            : `Welcome to Pinoy iMD :) `}
          {capitalize(aka)}
        </MDBBadge>
      </MDBNavbarBrand>
      <MDBNavbarNav
        expand="sm"
        right
        style={{ flexDirection: "row", gap: "5px" }}
      >
        {access.length > 0 && <DTR />}
        <Branches />
        <Platforms />
        <Profile />
      </MDBNavbarNav>
    </MDBNavbar>
  );
}
