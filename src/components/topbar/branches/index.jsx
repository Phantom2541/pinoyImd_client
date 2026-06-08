import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import {
  EnterPatronMode,
  SETACTIVEAFFILIATION,
} from "../../../services/redux/slices/assets/persons/auth.js";

const PATRON_BRANCH_OPTION = {
  _id: "__patron__",
  isPatron: true,
};

const isVisibleAffiliation = (branch = {}) => {
  const hiddenStatuses = ["pending", "banned", "blk", "blacklisted"];
  const status = String(branch?.status || "")
    .trim()
    .toLowerCase();

  return !hiddenStatuses.includes(status);
};

export default function Branches() {
  const { branches = [], auth = {}, token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch(),
    history = useHistory();
  const isPatronMode =
    localStorage.getItem("preferredAffiliationMode") === "patron";
  const visibleBranches = useMemo(
    () => branches.filter(isVisibleAffiliation),
    [branches],
  );

  const activeAffiliation = auth?.activeAffiliation || "";
  const currentAffiliation = useMemo(() => {
    const matchedAffiliation = visibleBranches.find(
      ({ affiliationId, _id }) =>
        String(affiliationId || _id) === String(activeAffiliation),
    );

    return matchedAffiliation || (visibleBranches.length === 1 ? visibleBranches[0] : {});
  }, [visibleBranches, activeAffiliation]);

  const branchOptions = useMemo(
    () => [...visibleBranches, PATRON_BRANCH_OPTION],
    [visibleBranches],
  );

  useEffect(() => {
    if (
      activeAffiliation ||
      isPatronMode ||
      visibleBranches.length !== 1 ||
      !auth?._id
    )
      return;

    const onlyAffiliationId =
      visibleBranches[0]?.affiliationId || visibleBranches[0]?._id;
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
  }, [
    activeAffiliation,
    auth,
    visibleBranches,
    dispatch,
    isPatronMode,
    token,
  ]);

  const handleActiveBranch = (affiliationId) => {
    if (affiliationId === PATRON_BRANCH_OPTION._id) {
      dispatch(EnterPatronMode());
      history.push("/patron/bulletin");
      return;
    }

    const data = {
      _id: auth._id,
      activeAffiliation: affiliationId,
    };

    localStorage.removeItem("preferredAffiliationMode");
    dispatch(SETACTIVEAFFILIATION({ data, token }));
  };

  const toAcronym = (value = "") =>
    String(value)
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  const pickAcronym = (...candidates) => {
    const found = candidates.find(
      (candidate) => String(candidate || "").trim().length > 0,
    );

    return String(found || "")
      .trim()
      .toUpperCase();
  };

  const getCompanyAcronym = (affiliation = {}) => {
    const branchRef = affiliation?.branch || {};
    const companyRef =
      branchRef?.companyId ||
      affiliation?.companyId ||
      affiliation?.company ||
      {};

    return (
      pickAcronym(
        companyRef?.abbr,
        companyRef?.acronym,
        affiliation?.companyAbbr,
        affiliation?.companyCode,
      ) ||
      toAcronym(
        companyRef?.name ||
          companyRef?.displayname ||
          affiliation?.companyName ||
          "",
      )
    );
  };

  const getBranchAcronym = (affiliation = {}) => {
    const rawName = affiliation?.name || affiliation?.displayname || "";

    const explicitBranchAcronym = pickAcronym(affiliation?.name);

    if (explicitBranchAcronym) return explicitBranchAcronym;

    return toAcronym(rawName);
  };

  const formatBranchLabel = (affiliation = {}) => {
    if (affiliation?.isPatron) return "Patron";

    const companyAcronym = getCompanyAcronym(affiliation);
    const branchAcronym = getBranchAcronym(affiliation);

    const isMain = affiliation?.branch?.isMain || affiliation?.isMain || false;

    if (companyAcronym && branchAcronym) {
      return `${companyAcronym} - ${branchAcronym}${isMain ? " (Main)" : ""}`;
    }

    if (companyAcronym) return companyAcronym;
    if (branchAcronym) return `${branchAcronym}${isMain ? " (Main)" : ""}`;

    return "";
  };

  const branchLabel = activeAffiliation && currentAffiliation?._id
    ? formatBranchLabel(currentAffiliation)
    : "Patron";

  return (
    <MDBDropdown>
      {branchOptions.length > 1 && (
        <MDBDropdownToggle nav caret>
          <MDBIcon icon="code-branch" />
          &nbsp;
          <div className="d-none d-md-inline">{branchLabel || ""}</div>
        </MDBDropdownToggle>
      )}
      <MDBDropdownMenu right>
        {branchOptions.map((item, index) => {
          const { _id, affiliationId } = item;
          const itemAffiliationId = affiliationId || _id;

          return (
            <MDBDropdownItem
              active={
                item?.isPatron
                  ? !activeAffiliation
                  : String(itemAffiliationId) ===
                    String(
                      activeAffiliation ||
                        currentAffiliation?.affiliationId ||
                        currentAffiliation?._id,
                    )
              }
              key={`branch-${index}`}
              onClick={() => handleActiveBranch(itemAffiliationId)}
            >
              {formatBranchLabel(item)}
            </MDBDropdownItem>
          );
        })}
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
