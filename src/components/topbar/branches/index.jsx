import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { capitalize } from "../../../services/utilities";
import { SETACTIVEPLATFORM } from "../../../services/redux/slices/assets/persons/auth.js";

export default function Branches() {
  const [text, setText] = useState("Branches"),
    { branches, activePlatform, token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  useEffect(() => {
    const timer = setInterval(() => {
      setText((prev) =>
        prev === activePlatform?.name ? "Branches" : activePlatform?.name
      );
    }, 10000);

    return () => clearInterval(timer);
  }, [activePlatform]);

  const handleActivePlatform = (branchId) => {
    const data = { activePlatform: { ...activePlatform, branchId } };
    console.log("new activePlatform :", activePlatform);

    dispatch(SETACTIVEPLATFORM(data, token));
  };

  return (
    <MDBDropdown>
      <MDBDropdownToggle nav caret>
        <MDBIcon icon="code-branch" />
        &nbsp;
        <div className="d-none d-md-inline">{capitalize(text)}</div>
      </MDBDropdownToggle>
      <MDBDropdownMenu right>
        {branches.map(({ name, _id }, index) => (
          <MDBDropdownItem
            active={_id === activePlatform?.branchId}
            key={`branch-${index}`}
            onClick={() => handleActivePlatform(_id)}
          >
            {capitalize(name)}
          </MDBDropdownItem>
        ))}
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
