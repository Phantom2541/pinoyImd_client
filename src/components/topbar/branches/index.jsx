import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
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

  const branchLabel = formatBranchLabel(currentAffiliation);

  return (
    <MDBDropdown>
      {branches.length > 1 && (
        <MDBDropdownToggle nav caret>
          <MDBIcon icon="code-branch" />
          &nbsp;
          <div className="d-none d-md-inline">{branchLabel || ""}</div>
        </MDBDropdownToggle>
      )}
      <MDBDropdownMenu right>
        {branches.map((item, index) => {
          const { _id, affiliationId } = item;
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
              {formatBranchLabel(item)}
            </MDBDropdownItem>
          );
        })}
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
