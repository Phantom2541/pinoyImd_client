import React, { useMemo } from "react";
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
  const { auth = {}, branches = [] } = useSelector((state) => state.auth);
  const visibleBranches = useMemo(
    () =>
      branches.filter((branch = {}) => {
        const hiddenStatuses = ["pending", "banned", "blk", "blacklisted"];
        const status = String(branch?.status || "")
          .trim()
          .toLowerCase();

        return !hiddenStatuses.includes(status);
      }),
    [branches],
  );
  const currentAffiliation = useMemo(() => {
    const matchedAffiliation = visibleBranches.find(
      ({ affiliationId, _id }) =>
        String(affiliationId || _id) === String(auth?.activeAffiliation || ""),
    );

    return matchedAffiliation || (visibleBranches.length === 1 ? visibleBranches[0] : {});
  }, [visibleBranches, auth?.activeAffiliation]);
  const activePlatforms = Array.isArray(currentAffiliation?.platforms)
    ? currentAffiliation.platforms
    : [];
  const selectedPlatform = currentAffiliation?.activePlatform || "";
  const aka = auth?.alias || auth?.fullName?.fname;
  const employmentStatus =
    currentAffiliation?.contract?.soe || currentAffiliation?.status;

  const navStyle = {
    paddingLeft: toggle ? "16px" : "240px",
    transition: "padding-left .3s",
  };
  const isEmployed = employment.isEmployed(
    auth?.isPhysician ? "active" : employmentStatus,
  );
  return (
    <MDBNavbar
      className="flexible-MDBNavbar"
      light
      expand="md"
      scrolling
      fixed="top"
      style={{ zIndex: 999 }}
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
            {activePlatforms.length > 0 && isEmployed
              ? `${capitalize(currentAffiliation?.department || "")} :)`
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
          {activePlatforms.length > 0 && isEmployed && (
            <DTR
              currentAffiliation={currentAffiliation}
              selectedPlatform={selectedPlatform}
            />
          )}
          <Branches />
          <Platforms />
          <Profile
            currentAffiliation={currentAffiliation}
            selectedPlatform={selectedPlatform}
          />
        </MDBNavbarNav>
      </div>
    </MDBNavbar>
  );
}
