import { useEffect, useState, useCallback, useMemo } from "react";
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
import { SETAFFILIATIONPLATFORM } from "../../../services/redux/slices/assets/persons/affiliations";

const platformCatalog = Access.collections || [];
const platformAliases = {
  accre: "accreditation",
  accreditation: "accreditation",
  accredetation: "accreditation",
  accreditation: "accreditation",
  admin: "administrator",
  administrative: "administrator",
  administrator: "administrator",
  accounting: "accounting",
  auditor: "auditor",
  author: "author",
  cashier: "cashier",
  frontdesk: "frontdesk",
  manager: "manager",
  patron: "patron",
  hr: "hr",
  "human resources": "hr",
  human_resources: "hr",
  laboratory: "laboratory",
  lab: "laboratory",
  radiology: "radiology",
  rad: "radiology",
  pharmacist: "pharmacist",
  pharmacy: "pharmacist",
  procurement: "procurement",
  utility: "utility",
  clinical: "clinical",
  clinic: "clinical",
  physician: "physician",
  dr: "physician",
  headquarter: "headquarter",
  headquarters: "headquarter",
  superadmin: "superadmin",
  "service engineer": "serviceengineer",
  service_engineer: "serviceengineer",
  serviceengineer: "serviceengineer",
  se: "serviceengineer",
};

const normalizePlatform = (value = "") => {
  const cleanedValue = String(value || "")
    .trim()
    .toLowerCase();

  if (!cleanedValue) return "";

  const matchedPlatform = platformCatalog.find(({ platform, code, name }) => {
    const normalizedPlatform = String(platform || "")
      .trim()
      .toLowerCase();
    const normalizedCode = String(code || "")
      .trim()
      .toLowerCase();
    const normalizedName = String(name || "")
      .trim()
      .toLowerCase();

    return (
      normalizedPlatform === cleanedValue ||
      normalizedCode === cleanedValue ||
      normalizedName === cleanedValue
    );
  });

  const normalizedMatch = matchedPlatform
    ? String(
        matchedPlatform.code ||
          matchedPlatform.platform ||
          matchedPlatform.name ||
          "",
      )
        .trim()
        .toLowerCase()
    : cleanedValue;

  return (
    platformAliases[normalizedMatch] ||
    platformAliases[cleanedValue] ||
    cleanedValue.replace(/\s+/g, "_")
  );
};

const getPlatformLabel = (value = "") => {
  const normalizedValue = normalizePlatform(value);
  const matchedPlatform = platformCatalog.find(
    ({ platform, code, name }) =>
      normalizePlatform(platform) === normalizedValue ||
      normalizePlatform(code) === normalizedValue ||
      normalizePlatform(name) === normalizedValue,
  );

  return matchedPlatform?.name || capitalize(normalizedValue.replace(/_/g, " "));
};

export default function Platforms() {
  const { activePlatform, auth, branches = [], token } = useSelector(
      ({ auth }) => auth,
    ),
    dispatch = useDispatch(),
    history = useHistory();

  const affiliationId = auth?.activeAffiliation || "";
  const currentAffiliation = useMemo(
    () =>
      branches.find(
        ({ affiliationId: currentAffiliationId, _id }) =>
          String(currentAffiliationId || _id) === String(affiliationId),
      ) || {},
    [branches, affiliationId],
  );

  const [access, setAccess] = useState([]);
  const isDraft = activePlatform?.branch?.settings?.status === "Draft";

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
    if (!affiliationId || access.length !== 1) return;

    const selectedPlatform = String(
      currentAffiliation?.activePlatform || activePlatform?.platform || "",
    )
      .trim()
      .toLowerCase();

    if (selectedPlatform === access[0]) return;

    dispatch(
      SETAFFILIATIONPLATFORM({
        data: {
          _id: auth._id,
          email: auth.email,
          activeAffiliation: affiliationId,
          activePlatform: access[0],
        },
        token,
      }),
    );
  }, [access, activePlatform, affiliationId, auth, currentAffiliation, dispatch, token]);

  const handlePlatform = useCallback(
    (platform) => {
      const cleanedPlatform = normalizePlatform(platform);

      dispatch(
        SETAFFILIATIONPLATFORM({
          data: {
            _id: auth._id,
            email: auth.email,
            activeAffiliation: affiliationId,
            activePlatform: cleanedPlatform || "patron",
          },
          token,
        }),
      );

      const routePlatform = cleanedPlatform;
      const isManager = routePlatform === "manager";
      const redirectURL = `/${routePlatform}/${
        isManager ? "dashboard" : "bulletin"
      }`;
      history.push(redirectURL);
    },
    [affiliationId, auth, dispatch, history, token],
  );

  if (access.length <= 1) return null;

  const allowedPlatformsInDraft = ["manager", "headquarter", "superadmin"];
  const visiblePlatform =
    currentAffiliation?.activePlatform || activePlatform?.platform || access[0] || "patron";

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
                handlePlatform(platform);
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
