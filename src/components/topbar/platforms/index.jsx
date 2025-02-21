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

export default function Platforms() {
  const { activePlatform, token, auth } = useSelector(({ auth }) => auth),
    [access, setAccess] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    setAccess(activePlatform.access);

    // const timer = setInterval(() => {
    //   setText((prev) =>
    //     prev === activePlatform?.name ? "Branches" : activePlatform?.name
    //   );
    // }, 10000);
    // return () => clearInterval(timer);
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
    window.location.href = "/dashboard";
  };

  return (
    <MDBDropdown>
      <MDBDropdownToggle nav caret>
        <MDBIcon icon="network-wired" />
        &nbsp;
        <div className="d-none d-md-inline">
          {capitalize(activePlatform.platform)}
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
