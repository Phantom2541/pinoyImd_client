import { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { capitalize } from "../../../services/utilities";
import { SETACTIVEPLATFORM } from "../../../services/redux/slices/assets/persons/auth";

export default function Platforms() {
  const { activePlatform, token, auth } = useSelector(({ auth }) => auth),
    dispatch = useDispatch(),
    history = useHistory();

  const [access, setAccess] = useState([]);
  const isDraft = activePlatform?.branch?.settings?.status === "Draft";

  useEffect(() => {
    const platforms = activePlatform?.access || [];
    const uniqueSorted = Array.from(new Set([...platforms, "patron"])).sort(
      (a, b) => a.localeCompare(b)
    );
    setAccess(uniqueSorted);
  }, [activePlatform]);

  const handlePlatform = useCallback(
    (platform) => {
      const cleanedPlatform = platform.toLowerCase().replace(/\s+/g, "");

      dispatch(
        SETACTIVEPLATFORM({
          data: {
            _id: auth._id,
            email: auth.email,
            activePlatform: {
              ...activePlatform,
              platform: cleanedPlatform || "patron",
            },
          },
          token,
        })
      );

      const isManager = cleanedPlatform === "manager";
      const redirectURL = `/${cleanedPlatform}/${
        isManager ? "dashboard" : "bulletin"
      }`;
      history.push(redirectURL);
    },
    [auth, activePlatform, dispatch, token, history]
  );

  if (access.length <= 1) return null;

  const allowedPlatformsInDraft = ["manager", "headquarter", "superadmin"];

  return (
    <MDBDropdown className="sample">
      <MDBDropdownToggle
        nav
        caret
        id="platforms-dropdown"
        title={
          isDraft
            ? "Some platforms are currently disabled because this branch is still in draft mode.   Please complete the Menu, Services, Staff, and Signatories to unlock full access.    Once done, kindly inform us so we can activate your full system access."
            : "Switch between your available platforms."
        }
      >
        <MDBIcon icon="network-wired" />
        &nbsp;
        <div className="d-none d-md-inline">
          {capitalize(activePlatform?.platform || "patron")}
        </div>
      </MDBDropdownToggle>
      <MDBDropdownMenu right id="platforms-dropdown-menu">
        {access.map((platform, index) => {
          const cleanedPlatform = platform.toLowerCase();
          const isDisabled =
            isDraft &&
            !allowedPlatformsInDraft.includes(cleanedPlatform.toLowerCase());

          return (
            <MDBDropdownItem
              key={index}
              onClick={(e) => {
                if (isDisabled) {
                  e.preventDefault(); // prevent default action
                  e.stopPropagation(); // stop from closing dropdown
                  return;
                }
                handlePlatform(platform);
              }}
              style={{
                color: isDisabled ? "#aaa" : "#212529",
                pointerEvents: isDisabled ? "none" : "auto",
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
            >
              {capitalize(platform)}
            </MDBDropdownItem>
          );
        })}
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
