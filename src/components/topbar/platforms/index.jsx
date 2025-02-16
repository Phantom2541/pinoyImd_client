import React, { useEffect, useState } from "react";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { useSelector, useDispatch } from "react-redux";
import { capitalize } from "../../../services/utilities";
import { UPDATE } from "../../../services/redux/slices/assets/persons/auth";

export default function Platforms() {
  const [text, setText] = useState("Platforms"),
    { activePlatform, token, auth, access, onDuty } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const changePlatform = platform => {
    
    if (platform !== activePlatform) {
      localStorage.setItem("activePlatform", platform);
      dispatch(UPDATE({
        data: {
          _id: auth._id,
          email: auth.email,
          activePlatform: {
            branch: onDuty._id,
            platform: platform,
            role: platform
          }
        }, token
      }));
      window.location.href = "/dashboard";
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setText(prev => (prev === activePlatform ? "Platforms" : activePlatform));
    }, 10000);

    return () => clearInterval(timer);
  }, [activePlatform]);

  return (
    <MDBDropdown>
      <MDBDropdownToggle nav caret>
        <MDBIcon icon="network-wired" />
        &nbsp;
        <div className="d-none d-md-inline">{capitalize(text)}</div>
      </MDBDropdownToggle>
      <MDBDropdownMenu right>
        {access
          .filter(({ status }) => status) // filter disabled status
          .map(({ platform }, index) => (
            <MDBDropdownItem
              active={platform === activePlatform}
              key={`platform-${index}`}
              onClick={() => changePlatform(platform)}
            >
              {capitalize(platform)}
            </MDBDropdownItem>
          ))}
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
