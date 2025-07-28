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
import { capitalize, employment } from "../../services/utilities";
import DTR from "./dtr";

export default function TopNavigation({ toggle, onSideNavToggleClick }) {
  const { activePlatform, auth } = useSelector((state) => state.auth);
  const aka = auth?.alias || auth?.fullName?.fname;

  const navStyle = {
    paddingLeft: toggle ? "16px" : "240px",
    transition: "padding-left .3s",
  };
  const isEmployed = employment.isEmployed(activePlatform?.branch?.status);
  return (
    <MDBNavbar
      className="flexible-MDBNavbar"
      light
      expand="md"
      scrolling
      fixed="top"
      style={{ zIndex: 3 }}
    >
      <div className="d-flex justify-content-between align-items-center w-100">
        <div
          onClick={onSideNavToggleClick}
          style={{
            lineHeight: "32px",
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
          >
            {activePlatform?.access?.length > 0 && isEmployed
              ? `${capitalize(activePlatform?.department)} :)`
              : `Welcome to Pinoy iMD :) `}
            {capitalize(aka)}
          </MDBBadge>
        </MDBNavbarBrand>
        <MDBNavbarNav
          expand="sm"
          right
          style={{
            flexDirection: "row",
            gap: "5px",
          }}
        >
          {activePlatform?.access?.length > 0 && isEmployed && <DTR />}
          <Branches />
          <Platforms />
          <Profile />
        </MDBNavbarNav>
      </div>
    </MDBNavbar>
  );
}
