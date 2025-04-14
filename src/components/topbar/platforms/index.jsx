import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { capitalize } from "../../../services/utilities";
import { SETACTIVEPLATFORM } from "../../../services/redux/slices/assets/persons/auth";
// import { useNavigate } from "react-router-dom";
export default function Platforms() {
  const { activePlatform, token, auth } = useSelector(({ auth }) => auth),
    [access, setAccess] = useState([]),
    dispatch = useDispatch();
  // const navigate = useNavigate();
  useEffect(() => {
    setAccess([...activePlatform.access, "Patron"]);
  }, [activePlatform]);

  const handlePlatform = (platform) => {
    dispatch(
      SETACTIVEPLATFORM({
        data: {
          _id: auth._id,
          email: auth.email,
          activePlatform: {
            ...activePlatform,
            platform,
          },
        },
        token,
      })
    );

    // Check if the selected platform is "Manager"
    const isManager = platform.toLowerCase() === "manager";

    // Define redirect URL based on platform
    const redirectURL = `/${platform.toLowerCase()}/${
      isManager ? "dashboard" : "bulletin"
    }`; // Adjust path as needed

    // Redirect using React Router
    // navigate(redirectURL);

    // OR, if not using React Router, use:
    window.location.href = redirectURL;
  };
  return (
    <MDBDropdown>
      <MDBDropdownToggle nav caret>
        <MDBIcon icon="network-wired" />
        &nbsp;
        <div className="d-none d-md-inline">
          {capitalize(activePlatform?.platform)}
        </div>
      </MDBDropdownToggle>
      <MDBDropdownMenu right>
        {access?.map((platform, index) => (
          <MDBDropdownItem
            key={`platform-${index}`}
            onClick={() => handlePlatform(platform)}
          >
            {capitalize(platform)}
          </MDBDropdownItem>
        ))}
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
