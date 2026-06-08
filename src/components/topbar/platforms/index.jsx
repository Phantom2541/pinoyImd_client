import { useEffect, useState, useMemo } from "react";
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

export default function Platforms() {
  const { auth, branches = [], token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch(),
    history = useHistory();

  const affiliationId = auth?.activeAffiliation || "";
  const currentAffiliation = useMemo(() => {
    const matchedAffiliation = branches.find(
      ({ affiliationId: currentAffiliationId, _id }) =>
        String(currentAffiliationId || _id) === String(affiliationId),
    );

    return matchedAffiliation || (branches.length === 1 ? branches[0] : {});
  }, [branches, affiliationId]);
  const currentAffiliationId =
    currentAffiliation?.affiliationId || currentAffiliation?._id || "";

  const [access, setAccess] = useState([]);
  const selectedPlatform = normalizePlatform(
    currentAffiliation?.activePlatform || "",
  );
  const isDraft = currentAffiliation?.branch?.settings?.status === "Draft";
  const isDiagnostics = diagnosticsCategories.includes(
    String(currentAffiliation?.branch?.category || "")
      .trim()
      .toLowerCase(),
  );

  useEffect(() => {
    const platforms = (currentAffiliation?.platforms || [])
      .map((platform) => normalizePlatform(platform))
      .filter(Boolean);
    const uniqueSorted = Array.from(new Set(platforms)).sort((a, b) =>
      a.localeCompare(b),
    );

    setAccess(uniqueSorted);
  }, [currentAffiliation]);

  useEffect(() => {
    if (!currentAffiliationId || access.length !== 1) return;

    if (selectedPlatform === access[0]) return;

    dispatch(
      SETAFFILIATIONPLATFORM({
        data: {
          _id: currentAffiliationId,
          activePlatform: access[0],
        },
        token,
      }),
    );
  }, [access, currentAffiliationId, dispatch, selectedPlatform, token]);

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

  if (access.length <= 1) return null;

  const allowedPlatformsInDraft = ["manager", "headquarter", "superadmin"];
  const visiblePlatform = selectedPlatform || access[0] || "patron";

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
        {access.map((platform, index) => {
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
