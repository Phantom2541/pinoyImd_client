import { useState, useEffect } from "react";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { useSelector } from "react-redux";
import {
  PresetImage,
  clearSiteData,
  employment,
} from "../../../services/utilities";
import { useHistory } from "react-router";

export default function Profile() {
  const { auth, isPatient, image, activePlatform } = useSelector(
      ({ auth }) => auth
    ),
    [platform, setPlatform] = useState("patron"),
    history = useHistory();

  useEffect(() => {
    setPlatform(activePlatform?.platform);
  }, [activePlatform]);
  const handleLogout = () => {
    const { branch = {} } = activePlatform || {};
    const { companyId: company = "" } = branch || {};
    var companyId = company?._id || "";
    const fakeDB = localStorage.getItem("companyId");
    if (fakeDB && !company?._id) {
      companyId = fakeDB.replace(/"/g, "");
    }
    localStorage.clear();
    if (companyId !== "null" && companyId !== null) {
      history.push(`/subscribers/${companyId}`);
    } else {
      history.push(`/`);
    }
    clearSiteData();
  };
  const isEmployed = employment.isEmployed(activePlatform?.branch?.status);
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
