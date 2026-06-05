import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { capitalize } from "../../../services/utilities";
import { SETACTIVEAFFILIATION } from "../../../services/redux/slices/assets/persons/auth.js";

export default function Branches() {
  const {
      branches = [],
      activePlatform = {},
      token,
      auth,
    } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const handleActiveBranch = (affiliationId) => {
    const data = {
      _id: auth._id,
      email: auth.email,
      activeAffiliation: affiliationId,
    };

    dispatch(SETACTIVEAFFILIATION({ data, token }));
  };

  const { branch = {} } = activePlatform || {};
  // &&
  // branches[0]?.name === activePlatform?.branch?.name
  const branchName = branch?.name || branch?.displayname;
  return (
    <MDBDropdown>
      {branches.length > 1 && (
        <MDBDropdownToggle nav caret>
          <MDBIcon icon="code-branch" />
          &nbsp;
          <div className="d-none d-md-inline">
            {branchName ? capitalize(branchName) : ""}
          </div>
        </MDBDropdownToggle>
      )}
      <MDBDropdownMenu right>
        {branches?.map(({ name, _id, affiliationId, displayname }, index) => (
          <MDBDropdownItem
            active={(affiliationId || _id) === activePlatform?.affiliationId}
            key={`branch-${index}`}
            onClick={() => handleActiveBranch(affiliationId || _id)}
          >
            {capitalize(name || displayname)}
          </MDBDropdownItem>
        ))}
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
