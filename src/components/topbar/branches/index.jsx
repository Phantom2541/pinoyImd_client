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
import { SETACTIVEPLATFORM } from "../../../services/redux/slices/assets/persons/auth.js";

export default function Branches() {
  const {
      branches = [],
      access,
      activePlatform = {},
      token,
      auth,
    } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();
  console.log("branches:", branches);

  const handleActivePlatform = (branchId) => {
    const _access =
      access
        .filter((branch) => branch.branchId === branchId)
        .flatMap(({ platform }) => platform) || [];

    const data = {
      _id: auth._id,
      email: auth.email,
      activePlatform: {
        ...activePlatform,
        branchId,
        position: branchId.posotion,
        access: [..._access],
      },
    };

    dispatch(SETACTIVEPLATFORM({ data, token }));
  };

  const { branch = {} } = activePlatform || {};
  // &&
  // branches[0]?.name === activePlatform?.branch?.name
  return (
    <MDBDropdown>
      {branches.length > 1 && (
        <MDBDropdownToggle nav caret>
          <MDBIcon icon="code-branch" />
          &nbsp;
          <div className="d-none d-md-inline">
            {branch?.name ? capitalize(branch?.name) : ""}
          </div>
        </MDBDropdownToggle>
      )}
      <MDBDropdownMenu right>
        {branches?.map(({ name, _id }, index) => (
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
