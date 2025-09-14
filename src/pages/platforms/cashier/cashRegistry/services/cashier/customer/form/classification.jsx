import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBadge, MDBBtn, MDBTypography } from "mdbreact";
import { useHistory } from "react-router";
import {
  Categories,
  Privileges,
} from "../../../../../../../../services/fakeDb";
import {
  SETCATEGORY,
  SETPRIVILEGE,
  SETPHYSICIAN,
  SETSOURCE,
  SETSSX,
  RESET_INSOURCE,
  SetCH,
} from "../../../../../../../../services/redux/slices/commerce/pos/services/pos";
import {
  INSOURCE,
  SETSOURCES,
  RESET as SOURCERESET,
} from "../../../../../../../../services/redux/slices/assets/providers";
import { BROWSE as BROWSE_BRANCHES } from "../../../../../../../../services/redux/slices/assets/branches";
import { capitalize } from "lodash";
import PickPhysician from "../../../../../../../../components/searchables/physicians/pickPhysician";
import { CardHolders } from "../../../../../../../../services/fakeDb/finance";
import CardCompany from "./cardCompany";
const contracts = {
  sbc: "Subcontract",
  ssc: "Special Subcontract",
};

export default function PosCard() {
  const {
      category,
      privilege,
      customer,
      ssx,
      sourceId,
      formSubmitted,
      isSuccess,
      cardHolder,
    } = useSelector(({ pos }) => pos),
    { collections } = useSelector(({ providers }) => providers),
    { collections: inhouse } = useSelector(({ branches }) => branches),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [physicians, setPhysicians] = useState([]),
    [categories, setCategories] = useState([]),
    [source, setSource] = useState({}),
    [scType, setScType] = useState("rfr"), //Source Type
    dispatch = useDispatch(),
    history = useHistory();

  const { branch = {} } = activePlatform;
  const { companyId: company = {} } = branch || {};
  useEffect(() => {
    const fakeDB = localStorage.getItem("activePlatform");
    if (fakeDB) {
      setCategories(JSON.parse(fakeDB)?.branch?.companyId?.pc?.filter(Boolean));
    }
  }, []);

  useEffect(() => {
    dispatch(BROWSE_BRANCHES({ token, key: { companyId: company?._id } }));
  }, [company, dispatch, token]);

  useEffect(() => {
    if (token && activePlatform.branchId) {
      const branchId = activePlatform.branchId;

      // Check if the source data for the specific branchId is already in localStorage
      const storedSource = localStorage.getItem(`source_${branchId}`);

      if (storedSource) {
        // If source data is found in localStorage, use it (parse back to an object)
        const sourceData = JSON.parse(storedSource);

        // Optionally dispatch the source data to update the store
        dispatch(SETSOURCES(sourceData));
      } else {
        // If no data in localStorage, make the server request
        dispatch(
          INSOURCE({
            token,
            key: {
              vendors: activePlatform.branchId,
              status: "approved",
            },
          })
        )
          .then(({ payload }) => {
            // Assuming the response contains the source data in 'payload'
            const sourceData = payload.payload;
            // console.log("Fetching source data:", sourceData);

            // Store the fetched data in localStorage for future use
            localStorage.setItem(
              `source_${branchId}`,
              JSON.stringify(sourceData)
            );
          })
          .catch((error) => {
            console.error("Error fetching source data:", error);
          });
      }

      // Cleanup function
      return () => {
        dispatch(SOURCERESET());
      };
    }
  }, [token, dispatch, activePlatform]);

  const { _id, privilege: userPrivilege = 0 } = customer,
    didSelect = Boolean(_id);

  const handleCategory = (category) => {
    const { abbr } = Categories[category];
    const _abbr = [
      "wi",
      "opd",
      "er",
      "cw",
      "pw",
      "bp",
      "mc",
      "prm",
      "sc",
      "sr",
    ].includes(abbr)
      ? "rfr"
      : abbr;
    setScType(_abbr);
    setSource({});
    dispatch(RESET_INSOURCE());
    dispatch(SETCATEGORY(category));
  };
  const handlePrivilege = (privilege) => dispatch(SETPRIVILEGE(privilege));

  const isInhouse = scType === "inhouse";
  //filter the sources by source type
  const _sources = [...collections]?.filter(
    ({ category }) => category === scType
  );
  //if inhouse set the branches to sources if not get the filtered sources
  const sources = isInhouse
    ? inhouse.filter(({ _id }) => _id !== branch?._id)
    : _sources;

  const getPhysicians = (_id) => {
    if (!_id) return [];

    const branch = sources?.find(
      (source) => source._id.toString() === _id.toString()
    );
    return isInhouse ? branch?.affiliated : branch?.clients?.affiliated;
  };
  const handleSource = (_id) => {
    setPhysicians(getPhysicians(_id)); // Update the physicians list based on the filtered data
    // Dispatch the selected source
    // if membership is not null

    handlePhysician(""); // reset the selected pyhisican if change the source

    const _source = _id
      ? sources?.find((source) => source?._id.toString() === _id)
      : {};

    const { clients, _id: scID = "" } = _source || {};
    setSource(_source);
    dispatch(RESET_INSOURCE());
    dispatch(SETSOURCE(isInhouse ? scID : clients?._id));
  };
  const handlePhysician = (physician) => dispatch(SETPHYSICIAN({ physician }));
  const getCIndex = (abbr) =>
    Categories.findIndex(({ abbr: name }) => name === abbr);

  const getCHIndex = (abbr) =>
    CardHolders.findIndex(({ abbr: name }) => name === abbr);
  const srcEndPoint =
    Categories[getCIndex(scType)]?.name ||
    CardHolders[getCHIndex(scType)]?.name;
  const hasSources = sources?.length > 0;
  return (
    <>
      <div>
        <div className="patient-form">
          <span title="Signs and Symptoms">ssx</span>
          <input
            placeholder="3 days fever, headache (etc)..."
            type="text"
            value={ssx}
            onChange={({ target }) => dispatch(SETSSX(target.value))}
          />
        </div>
        <div className="patient-form mt-2">
          <span>Privilege</span>
          <select
            disabled={!didSelect}
            value={privilege}
            onChange={({ target }) => handlePrivilege(Number(target.value))}
          >
            {Privileges.map((privilege, index) => {
              let disabled = false;
              // Ensure only valid seniors can select "Senior Citizen" (index 2)
              if (index === 2 && userPrivilege !== 2) {
                disabled = true;
              }

              return (
                <option
                  disabled={disabled}
                  key={`privilege-${index}`}
                  value={index}
                >
                  {privilege}
                </option>
              );
            })}
          </select>
        </div>
        <div className="patient-form mt-2">
          <span>Category</span>
          <select
            disabled={!didSelect}
            value={category}
            onChange={({ target }) => handleCategory(Number(target.value))}
          >
            {[0, ...(categories || [])]?.map((c, index) => {
              const { name = "", color = "" } = Categories[c] || {};
              return (
                <option value={c} key={`category-${index}`} style={{ color }}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="patient-form mt-2">
          <span>Card Holder</span>
          <select
            disabled={!didSelect}
            value={cardHolder?.type}
            onChange={({ target }) => {
              const value = target.value;
              const haveSource = ["mbs", "ctr"].includes(value);
              if (haveSource) {
                setScType(value);
              }
              dispatch(SetCH({ type: target.value }));
            }}
          >
            <option value={""}>None</option>
            {CardHolders?.map(({ name = "", abbr = "", color = "" }, index) => {
              return (
                <option
                  value={abbr}
                  key={`category-${index}`}
                  style={{ color }}
                >
                  {name}
                </option>
              );
            })}
          </select>
        </div>
        <CardCompany />
        <div className="mt-2">
          <span style={{ fontSize: "0.9rem", fontWeight: 400 }}>
            Source Type:
          </span>
          <div className="d-flex align-items-center ">
            {[
              { text: "Referral", value: "rfr" },
              { text: "Inhouse", value: "inhouse" },
              { text: "Contract", value: "ctr" },
              { text: "Membership", value: "mbs" },
            ].map(({ text, value }, index) => (
              <MDBBtn
                disabled={!didSelect}
                size="sm"
                className={`px-2 py-${scType === value ? "2" : "1"}`}
                outline={scType !== value}
                color="info"
                key={index}
                onClick={() => {
                  setScType(value);
                  dispatch(RESET_INSOURCE());
                }}
              >
                {text}
              </MDBBtn>
            ))}
          </div>
        </div>
        <div className="patient-form ">
          <span>Source</span>
          <select
            disabled={!didSelect}
            onClick={() => {
              if (!hasSources)
                history.push(
                  `/cashier/sources/insources/${
                    !isInhouse ? srcEndPoint?.toLowerCase() : "inhouse"
                  }`
                );
            }}
            className={!hasSources ? "text-primary cursor-pointer" : ""}
            onChange={({ target }) => handleSource(target.value)}
          >
            <option value="">
              {!hasSources
                ? `No ${
                    isInhouse ? "Inhouse" : srcEndPoint
                  }. Click to register.`
                : "None"}
            </option>
            {sources?.map(({ _id, clients, name = "", displayname = "" }) => {
              const baseBranch = isInhouse
                ? displayname || name
                : clients?.displayname;
              return (
                <option key={_id} value={_id}>
                  {baseBranch}
                </option>
              );
            })}
          </select>
        </div>
        <div className="patient-form mt-2">
          {/* // wls */}

          {category === 7 && sourceId && scType === "mbs" && (
            <span>
              Membership :
              <MDBBadge
                color="warning"
                className="ml-1"
                style={{ fontSize: "0.8rem" }}
              >
                {capitalize(source?.membership)}{" "}
              </MDBBadge>
            </span>
          )}
          {category === 8 && sourceId && (
            <span>
              Contract :
              <MDBBadge
                color="warning"
                className="ml-1"
                style={{ fontSize: "0.8rem" }}
              >
                {capitalize(contracts[source?.contract])}
              </MDBBadge>
            </span>
          )}
        </div>

        {/* {source ? ( */}
        <div className="patient-form mt-2">
          <span className="d-block  ">Physician</span>
          <PickPhysician
            disabled={!didSelect}
            source={{ _id: source?._id }}
            suggested={physicians}
            onChange={(value) =>
              handlePhysician({
                ...value,
                source: {
                  _id: source?._id,
                  branch: isInhouse ? source?._id : source?.clients?._id,
                },
              })
            }
            formSubmitted={formSubmitted}
            isSuccess={isSuccess}
          />
        </div>
      </div>
      {!_id && (
        <MDBTypography note noteColor="info" className="mt-3 mb-0">
          Please search a patron first.
        </MDBTypography>
      )}
    </>
  );
}
