import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBadge, MDBTypography } from "mdbreact";
import { useHistory } from "react-router";
import {
  Categories,
  HMO,
  Privileges,
} from "../../../../../../../../services/fakeDb";
import {
  SETCATEGORY,
  SETPRIVILEGE,
  SETPHYSICIAN,
  SETSOURCE,
  SETSSX,
  RESET_INSOURCE,
  SETHMO,
} from "../../../../../../../../services/redux/slices/commerce/pos/services/pos";
import {
  INSOURCE as BROWSE_INSOURCE,
  SETSOURCES,
} from "../../../../../../../../services/redux/slices/assets/providers";
import {
  IDB_BULK_SAVE,
  IDB_BROWSE,
} from "../../../../../../../../services/indexDB/assets/insources";
import { capitalize } from "lodash";
import PickPhysician from "../../../../../../../../components/searchables/physicians/pickPhysician";
import { Tracker } from "../../../../../../../../services/utilities";
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
    } = useSelector(({ pos }) => pos),
    { collections } = useSelector(({ providers }) => providers),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [physicians, setPhysicians] = useState([]),
    [categories, setCategories] = useState([]),
    [sources, setSources] = useState([]),
    [source, setSource] = useState({}),
    [srcCIndex, setSrcCIndex] = useState(""), //Source Category Index
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
    const _sources = collections?.filter(({ category }) => category === _abbr);
    const scIndex = Categories.findIndex(({ abbr }) => abbr === _abbr);
    setSources(_sources);
    setSrcCIndex(scIndex);
  }, [category, collections]);

  useEffect(() => {
    const init = async () => {
      await Tracker.initialize({
        config: {
          token,
          branchId: activePlatform.branchId,
          trackerKey: "insource",
          params: {
            vendors: activePlatform.branchId,
            status: "approved",
          },
        },
        idb: { BROWSE: IDB_BROWSE, SAVE: IDB_BULK_SAVE },
        redux: {
          BROWSE: BROWSE_INSOURCE,
          SetCOLLECTIONS: SETSOURCES,
        },
      });
    };

    init();
  }, [token, activePlatform]);

  const { _id, privilege: userPrivilege = 0 } = customer,
    didSelect = Boolean(_id);

  const handleCategory = (category) => {
    setSource({});
    dispatch(RESET_INSOURCE());
    dispatch(SETCATEGORY(category));
  };
  const handlePrivilege = (privilege) => dispatch(SETPRIVILEGE(privilege));
  const handleSource = (_id) => {
    const _physicians =
      sources?.find((source) => source._id.toString() === _id.toString())
        ?.clients?.affiliated || []; // Ensure that `affiliated` is safe to access
    setPhysicians(_physicians); // Update the physicians list based on the filtered data
    // Dispatch the selected source
    // if membership is not null

    handlePhysician(""); // reset the selected pyhisican if change the source

    // if ([5, 6, 7].includes(category)) {
    //   dispatch(FIND({ token, key: { _id } }));
    // }
    const _source = sources?.find((source) => source?._id.toString() === _id);
    const { membership = "", contract = "", clients } = _source || {};
    setSource(_source);
    dispatch(RESET_INSOURCE());
    dispatch(SETSOURCE({ _id: clients?._id, membership, contract }));
  };
  const handlePhysician = (physician) => dispatch(SETPHYSICIAN({ physician }));

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
            {[0, ...categories]?.map((c, index) => {
              const { name = "", color = "" } = Categories[c];
              return (
                <option value={c} key={`category-${index}`} style={{ color }}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="patient-form mt-2">
          <span>Source</span>
          <select
            disabled={!didSelect}
            onClick={() => {
              if (!hasSources)
                history.push(
                  `/cashier/sources/insources/${Categories[
                    srcCIndex
                  ]?.name?.toLowerCase()}`
                );
            }}
            className={!hasSources ? "text-primary cursor-pointer" : ""}
            onChange={({ target }) => handleSource(target.value)}
          >
            <option value="">
              {!hasSources
                ? `No ${Categories[srcCIndex]?.name}. Click to register.`
                : "None"}
            </option>
            {sources?.map(({ _id, clients }) => (
              <option key={_id} value={_id}>
                {clients?.displayname}
              </option>
            ))}
          </select>
        </div>
        <div className="patient-form mt-2">
          {/* // wls */}
          {category === 6 && (
            <>
              <span>Card:</span>
              <select onChange={({ target }) => dispatch(SETHMO(target.value))}>
                <option value={""}>None</option>
                {company?.hmo?.map(({ code }) => (
                  <option value={code}>{HMO.getName(code)}</option>
                ))}
              </select>
            </>
          )}
          {category === 7 && sourceId && (
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
                source: { _id: source?._id, branch: source?.clients?._id },
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
