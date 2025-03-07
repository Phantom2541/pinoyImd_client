import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBCol, MDBRow, MDBTypography } from "mdbreact";

import {
  fullAddress,
  getAge,
  mobile,
  properFullname,
} from "../../../../../../../../services/utilities";
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
} from "../../../../../../../../services/redux/slices/commerce/pos/services/pos";
import {
  INSOURCE,
  SETSOURCES,
  RESET as SOURCERESET,
} from "../../../../../../../../services/redux/slices/assets/providers";

export default function PosCard() {
  const { category, privilege, customer } = useSelector(({ pos }) => pos),
    { collections: sources } = useSelector(({ providers }) => providers),
    { token, activePlatform } = useSelector(({ auth }) => auth),
    [physicians, setPhysicians] = useState([]),
    dispatch = useDispatch();

  useEffect(() => {
    if (token && activePlatform.branchId) {
      const branchId = activePlatform.branchId;

      // Check if the source data for the specific branchId is already in localStorage
      const storedSource = localStorage.getItem(`source_${branchId}`);

      if (storedSource) {
        // If source data is found in localStorage, use it (parse back to an object)
        const sourceData = JSON.parse(storedSource);
        console.log("Using stored source data:", sourceData);

        // Optionally dispatch the source data to update the store
        dispatch(SETSOURCES(sourceData));
      } else {
        // If no data in localStorage, make the server request
        dispatch(INSOURCE({ token, key: { vendors: activePlatform.branchId } }))
          .then(({ payload }) => {
            // Assuming the response contains the source data in 'payload'
            const sourceData = payload.payload;
            console.log("Fetching source data:", sourceData);

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

  const {
      dob,
      _id,
      email,
      mobile: _mobile,
      address,
      privilege: userPrivilege = 0,
    } = customer,
    didSelect = Boolean(_id),
    isSenior = getAge(dob, true) > 59; // detect if not a valid senior

  const handleCategory = (category) => dispatch(SETCATEGORY(category));
  const handlePrivilege = (privilege) => dispatch(SETPRIVILEGE(privilege));
  const handleSource = (_id) => {
    const _physicians =
      sources?.find((source) => source._id.toString() === _id.toString())
        ?.clients?.affiliated || []; // Ensure that `affiliated` is safe to access
    setPhysicians(_physicians); // Update the physicians list based on the filtered data
    dispatch(SETSOURCE({ _id })); // Dispatch the selected source
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
            onChange={({ target }) => dispatch(SETSSX(target.value))}
          />
        </div>
        <div className="patient-form">
          <span>Category</span>
          <select
            disabled={!didSelect}
            value={category}
            onChange={({ target }) => handleCategory(Number(target.value))}
          >
            {Categories.map(({ name, color }, index) => (
              <option
                value={index}
                key={`category-${index}`}
                style={{ backgroundColor: color }}
              >
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="patient-form">
          <span>Privilege</span>
          <select
            disabled={!didSelect}
            value={privilege}
            onChange={({ target }) => handlePrivilege(Number(target.value))}
          >
            {/* auto remove Senior Citizen from choices if not a valid senior */}
            {Privileges.filter((_, i) => isSenior || i !== 2).map(
              (privilege, index) => {
                let disabled = false,
                  // if privilegeIndex is greater than 0, disable all other choices
                  alreadyQualified = userPrivilege > 0;

                if (alreadyQualified) disabled = true;

                return (
                  <option
                    disabled={disabled}
                    key={`privilege-${index}`}
                    value={index}
                  >
                    {privilege}
                  </option>
                );
              }
            )}
          </select>
        </div>
        <div className="patient-form">
          <span>Source</span>
          <select
            disabled={!didSelect}
            onChange={({ target }) => handleSource(target.value)}
          >
            <option value="">None</option>
            {/* vendors : note if not register, will show the tempory details */}
            {sources?.map(({ _id, name, subName }) => (
              <option key={_id} value={_id}>
                {name?.toUpperCase()} {subName?.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
        <div className="patient-form">
          <span>Physician</span>
          <select
            disabled={!didSelect}
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
      </div>
      {_id ? (
        <div className="mt-2">
          <MDBRow>
            <MDBCol>
              <div className="pos-card-details">
                <span>Birthday:</span>
                <p>{new Date(dob).toDateString()}</p>
              </div>
            </MDBCol>
            <MDBCol>
              <div className="pos-card-details">
                <span>Age:</span>
                <p>{getAge(dob)}</p>
              </div>
            </MDBCol>
          </MDBRow>
          <MDBRow>
            <MDBCol>
              <div className="pos-card-details">
                <span>{_mobile ? "Contact Number" : "E-mail address"}:</span>
                <p>{_mobile ? mobile(_mobile) : email}</p>
              </div>
            </MDBCol>
            <MDBCol>
              <div className="pos-card-details">
                <span>Address:</span>
                <p>{fullAddress(address)}</p>
              </div>
            </MDBCol>
          </MDBRow>
        </div>
      ) : (
        <MDBTypography note noteColor="info" className="mt-3 mb-0">
          Please search a patron first.
        </MDBTypography>
      )}
    </>
  );
}
