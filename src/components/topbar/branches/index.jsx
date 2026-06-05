import React, { useEffect, useMemo } from "react";
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
  const currentAffiliation = useMemo(() => {
    const matchedAffiliation = branches.find(
      ({ affiliationId, _id }) =>
        String(affiliationId || _id) === String(activeAffiliation),
    );

    return matchedAffiliation || (branches.length === 1 ? branches[0] : {});
  }, [branches, activeAffiliation]);

  useEffect(() => {
    if (activeAffiliation || branches.length !== 1 || !auth?._id) return;

    const onlyAffiliationId = branches[0]?.affiliationId || branches[0]?._id;
    if (!onlyAffiliationId) return;

    dispatch(
      SETACTIVEAFFILIATION({
        data: {
          _id: auth._id,
          activeAffiliation: onlyAffiliationId,
        },
        token,
      }),
    );
  }, [activeAffiliation, auth, branches, dispatch, token]);

  const handleActiveBranch = (affiliationId) => {
    const data = {
      _id: auth._id,
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
        {branches.map(({ name, _id, affiliationId, displayname, branch }, index) => {
          const itemName =
            branch?.name || branch?.displayname || name || displayname || "";
          const itemAffiliationId = affiliationId || _id;

          return (
            <MDBDropdownItem
              active={
                String(itemAffiliationId) ===
                String(
                  activeAffiliation ||
                    currentAffiliation?.affiliationId ||
                    currentAffiliation?._id,
                )
              }
              key={`branch-${index}`}
              onClick={() => handleActiveBranch(itemAffiliationId)}
            >
              {capitalize(itemName)}
            </MDBDropdownItem>
          );
        })}
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
