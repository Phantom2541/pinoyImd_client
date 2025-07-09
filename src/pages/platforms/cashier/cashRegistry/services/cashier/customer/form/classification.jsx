import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBBadge, MDBTypography } from "mdbreact";

import { properFullname } from "../../../../../../../../services/utilities";
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
  INSOURCE,
  SETSOURCES,
  RESET as SOURCERESET,
} from "../../../../../../../../services/redux/slices/assets/providers";
import PickPhysician from "../../../../../../../../components/searchables/physicians/pickPhysician";
import { capitalize } from "lodash";
const contracts = {
  sbc: "Subcontract",
  ssc: "Special Subcontract",
};

export default function PosCard() {
  const { category, privilege, customer, ssx } = useSelector(({ pos }) => pos),
    { collections } = useSelector(({ providers }) => providers),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [physicians, setPhysicians] = useState([]),
    [categorySelected, setCategorySelected] = useState(),
    [categories, setCategories] = useState([]),
    [sources, setSources] = useState([]),
    [source, setSource] = useState(),
    dispatch = useDispatch();

  const { branch = {} } = activePlatform;
  const { companyId: company = {} } = branch || {};

  useEffect(() => {
    const fakeDB = localStorage.getItem("activePlatform");
    if (fakeDB) {
      setCategories(JSON.parse(fakeDB)?.branch?.companyId?.pc);
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
    ].includes(abbr)
      ? "rfr"
      : abbr;
    const _sources = collections?.filter(({ category }) => category === _abbr);
    setSources(_sources);
  }, [category, collections]);

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
  }, [token, dispatch, activePlatform, categorySelected]);

  const { _id, privilege: userPrivilege = 0 } = customer,
    didSelect = Boolean(_id);

  const handleCategory = (category) => {
    setCategorySelected(category);
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
            {categories?.map((c, index) => {
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
            onChange={({ target }) => handleSource(target.value)}
          >
            <option value="">None</option>
            {sources?.map(({ _id, clients }) => (
              <option key={_id} value={_id}>
                {/* {Memberships.find(({ value }) => value)?.emoji} */}
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
          {category === 7 && (
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
          {category === 8 && (
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

        {source ? (
          <div className="patient-form mt-2">
            <span>Physician</span>
            <select
              // disabled={!didSelect}
              onChange={({ target }) => handlePhysician(target.value)}
            >
              <option value="">None</option>
              {physicians?.length === 0 && (
                <option value="" disabled>
                  No Physicians where tag to this company
                </option>
              )}
              {physicians?.map(({ user }) => (
                <option key={user?._id} value={user?._id}>
                  {properFullname(user?.fullName)}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <PickPhysician
            label="Search Physician (lname,mname,fname)"
            selectedClassName="mt-2"
            disabled={!didSelect}
            globalSearch
            onClick={({ user }) => handlePhysician(user?._id)}
          />
        )}
      </div>
      {!_id && (
        <MDBTypography note noteColor="info" className="mt-3 mb-0">
          Please search a patron first.
        </MDBTypography>
      )}
    </>
  );
}
