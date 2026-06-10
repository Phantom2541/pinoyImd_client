import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdbreact";
import { capitalize } from "../../../services/utilities";
import { Access } from "../../../services/fakeDb";
import { getPlatformDefaultRoute } from "../../../services/fakeDb/sidebars";
import { SETAFFILIATIONPLATFORM } from "../../../services/redux/slices/assets/persons/affiliations";
import { SyncAffiliationPlatform } from "../../../services/redux/slices/assets/persons/auth";

const normalizePlatform = Access.normalizePlatformKey;
const getPlatformLabel = (value = "") =>
  capitalize(Access.getPlatformLabel(value).replace(/_/g, " "));
const diagnosticsCategories = [
  "diagnostic",
  "clinic",
  "laboratory",
  "radiology",
  "pharmacy",
  "infirmary",
  "hospital",
  "rehabilitation",
];

const isVisibleAffiliation = (branch = {}) => {
  const hiddenStatuses = ["pending", "banned", "blk", "blacklisted", "ghost"];
  const status = String(branch?.status || "")
    .trim()
    .toLowerCase();

  return !hiddenStatuses.includes(status);
};

export default function Platforms() {
  const {
      auth,
      branches = [],
      token,
      activePlatform = {},
    } = useSelector(({ auth }) => auth),
    dispatch = useDispatch(),
    history = useHistory();
  const visibleBranches = useMemo(
    () => branches.filter(isVisibleAffiliation),
    [branches],
  );
  const isPatronMode =
    !auth?.activeAffiliation ||
    normalizePlatform(activePlatform?.platform) === "patron" ||
    localStorage.getItem("preferredAffiliationMode") === "patron";

  const affiliationId = auth?.activeAffiliation || "";
  const currentAffiliation = useMemo(() => {
    const matchedAffiliation = visibleBranches.find(
      ({ affiliationId: currentAffiliationId, _id }) =>
        String(currentAffiliationId || _id) === String(affiliationId),
    );

    return matchedAffiliation || (visibleBranches.length === 1 ? visibleBranches[0] : {});
  }, [visibleBranches, affiliationId]);
  const currentAffiliationId =
    currentAffiliation?.affiliationId || currentAffiliation?._id || "";

  const selectedPlatform = normalizePlatform(
    currentAffiliation?.activePlatform || activePlatform?.platform || "",
  );
  const isDraft = currentAffiliation?.branch?.settings?.status === "Draft";
  const isDiagnostics = diagnosticsCategories.includes(
    String(currentAffiliation?.branch?.category || "")
      .trim()
      .toLowerCase(),
  );

  const platformOptions = useMemo(() => {
    if (isPatronMode) return [];

    const platforms = (currentAffiliation?.platforms || [])
      .map((platform) => normalizePlatform(platform))
      .filter(Boolean);
    const uniqueSorted = Array.from(new Set(platforms)).sort((a, b) =>
      a.localeCompare(b),
    );

    return uniqueSorted;
  }, [currentAffiliation, isPatronMode]);

  useEffect(() => {
    if (!currentAffiliationId || platformOptions.length !== 1) return;

    if (selectedPlatform === platformOptions[0]) return;

    dispatch(
      SETAFFILIATIONPLATFORM({
        data: {
          _id: currentAffiliationId,
          activePlatform: platformOptions[0],
        },
        token,
      }),
    );
  }, [
    currentAffiliationId,
    dispatch,
    platformOptions,
    selectedPlatform,
    token,
  ]);

  const handlePlatform = async (platform, event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    const cleanedPlatform = normalizePlatform(platform);
    if (!cleanedPlatform || !currentAffiliationId) return;

    const result = await dispatch(
      SETAFFILIATIONPLATFORM({
        data: {
          _id: currentAffiliationId,
          activePlatform: cleanedPlatform || "patron",
        },
        token,
      }),
    );

    if (SETAFFILIATIONPLATFORM.fulfilled.match(result)) {
      dispatch(
        SyncAffiliationPlatform({
          affiliationId: currentAffiliationId,
          platform: cleanedPlatform,
        }),
      );
      history.push(
        getPlatformDefaultRoute(cleanedPlatform, {
          isDiagnostics,
        }),
      );
    }
  };

  if (platformOptions.length <= 1) return null;

  const allowedPlatformsInDraft = ["manager", "headquarter", "superadmin"];
  const visiblePlatform = selectedPlatform || platformOptions[0] || "patron";

  return (
    <MDBDropdown className="sample">
      <MDBDropdownToggle
        nav
        caret
        id="platforms-dropdown"
        title={
          isDraft
            ? "Some platforms are currently disabled because this branch is still in draft mode.   Please complete the Menu, Services, Staff, and Signatories to unlock full access.    Once done, kindly inform us so we can activate your full system access."
            : "Switch between your available platforms."
        }
      >
        <MDBIcon icon="network-wired" />
        &nbsp;
        <div className="d-none d-md-inline">
          {getPlatformLabel(visiblePlatform)}
        </div>
      </MDBDropdownToggle>
      <MDBDropdownMenu right id="platforms-dropdown-menu">
        {platformOptions.map((platform, index) => {
          const cleanedPlatform = platform.toLowerCase();
          const isDisabled =
            isDraft &&
            !allowedPlatformsInDraft.includes(cleanedPlatform.toLowerCase());

          return (
            <MDBDropdownItem
              key={index}
              onClick={(e) => {
                if (isDisabled) {
                  e.preventDefault();
                  e.stopPropagation();
                  return;
                }
                handlePlatform(platform, e);
              }}
              style={{
                color: isDisabled ? "#aaa" : "#212529",
                pointerEvents: isDisabled ? "none" : "auto",
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
            >
              {getPlatformLabel(platform)}
            </MDBDropdownItem>
          );
        })}
      </MDBDropdownMenu>
    </MDBDropdown>
  );
}
