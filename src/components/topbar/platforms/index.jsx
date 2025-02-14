import React, { useEffect, useState } from "react";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { useSelector } from "react-redux";
import { capitalize } from "../../../services/utilities";

export default function Platforms() {
  const [text, setText] = useState("Platforms"),
    { activePlatform, access } = useSelector(({ auth }) => auth);

  const changePlatform = platform => {
    if (platform !== activePlatform) {
      localStorage.setItem("activePlatform", platform);
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
