import { useState, useEffect } from "react";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import {
  SignOut,
  SignOutDone,
} from "../../../services/redux/slices/assets/persons/auth";
import {
  PresetImage,
  clearSiteData,
  employment,
} from "../../../services/utilities";
import { useHistory } from "react-router";

// How long the "Signing you out..." screen stays after Log out.
const SIGN_OUT_SCREEN_MS = 2000;

export default function Profile({
  currentAffiliation = {},
  selectedPlatform = "",
}) {
  const { auth, isPatient, image, activePlatform } = useSelector(
      ({ auth }) => auth,
    ),
    [platform, setPlatform] = useState("patron"),
    dispatch = useDispatch(),
    history = useHistory();
  const employmentStatus =
    currentAffiliation?.contract?.soe ||
    currentAffiliation?.status ||
    activePlatform?.branch?.contract?.soe ||
    activePlatform?.branch?.status;

  useEffect(() => {
    setPlatform(
      selectedPlatform || currentAffiliation?.activePlatform || "patron",
    );
  }, [currentAffiliation, selectedPlatform]);
  const handleLogout = () => {
    const company = currentAffiliation?.companyId || {};
    var companyId = company?._id || "";
    const fakeDB = localStorage.getItem("companyId");
    if (fakeDB && !company?._id) {
      companyId = fakeDB.replace(/"/g, "");
    }
    // No clinic to return to (a patient, for instance): the start page.
    // "/subscribers/" with no id matches no page and leaves a blank screen.
    const hasCompany = companyId && companyId !== "null";

    // Signed out for real -- a password is needed to come back -- but who it
    // was is remembered, so "Welcome back" only asks for the password.
    const remembered = {
      email: auth?.email,
      pid: auth?.pid,
      isMale: auth?.isMale,
    };
    if (remembered.email) {
      localStorage.setItem("rememberedAccount", JSON.stringify(remembered));
    }
    dispatch(SignOut());
    history.push(hasCompany ? `/subscribers/${companyId}` : `/`);

    // Wipe everything else about the person; the redirect doesn't wait on it.
    // Kept: the clinic's id and public details (its page opens at once) and the
    // small remembered-account record.
    clearSiteData({
      keep: ["companyId", "patronCompany", "email", "rememberedAccount"],
    });

    // The next page appears in a blink, which can feel like nothing happened:
    // a short "Signing you out..." screen (see components/auth/signOutOverlay)
    // covers it. It is switched off by this timer, which outlives the page.
    setTimeout(() => dispatch(SignOutDone()), SIGN_OUT_SCREEN_MS);
  };
  const isEmployed = employment.isEmployed(
    auth?.isPhysician ? "active" : employmentStatus,
  );
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
        {/* {platform && ( */}
        <MDBDropdownItem
          href={`/${(platform || "patron")?.toLowerCase()}/profile`}
        >
          My Account
        </MDBDropdownItem>
        {/* )} */}
        {!isPatient && isEmployed && (
          <MDBDropdownItem
            disabled={!auth._id}
            href={`/${platform?.toLowerCase()}/contract`}
            title="i show dito ang contract sa active branch, need kasi malaman if LAB or RAD or Clinic"
          >
            Contract
          </MDBDropdownItem>
        )}
        <MDBDropdownItem onClick={handleLogout}>Log Out</MDBDropdownItem>
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
