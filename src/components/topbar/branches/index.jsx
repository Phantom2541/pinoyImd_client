import React, { useMemo } from "react";
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
  const { branches = [], auth = {}, token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const activeAffiliation = auth?.activeAffiliation || "";
  const currentAffiliation = useMemo(
    () =>
      branches.find(({ _id }) => String(_id) === String(activeAffiliation)) ||
      {},
    [branches, activeAffiliation],
  );

  const handleActiveBranch = (affiliationId) => {
    const data = {
      _id: auth._id,
      email: auth.email,
      activeAffiliation: affiliationId,
    };

    dispatch(SETACTIVEAFFILIATION({ data, token }));
  };

  const { branch = {}, name, displayname } = currentAffiliation;
  const branchName =
    branch?.name || branch?.displayname || name || displayname || "";

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
        {branches.map(({ name, _id, displayname, branch }, index) => {
          const itemName =
            branch?.name || branch?.displayname || name || displayname || "";

          return (
            <MDBDropdownItem
              active={String(_id) === String(activeAffiliation)}
              key={`branch-${index}`}
              onClick={() => handleActiveBranch(_id)}
            >
              {capitalize(itemName)}
            </MDBDropdownItem>
          );
        })}
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
