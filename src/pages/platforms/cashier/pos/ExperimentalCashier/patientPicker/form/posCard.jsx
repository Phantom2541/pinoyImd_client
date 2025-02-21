import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { MDBTypography } from "mdbreact";

import {
  fullAddress,
  getAge,
  mobile,
  properFullname,
} from "../../../../../../../services/utilities";
import { Categories, Privileges } from "../../../../../../../services/fakeDb";
<<<<<<<< HEAD:src/pages/platforms/cashier/pos/cashier/patientPicker/form/posCard.jsx
import { useSelector } from "react-redux";
========
import {
  SETCATEGORY,
  SETPRIVILEGE,
  SETPHYSICIAN,
  SETSOURCE,
} from "./../../../../../../../services/redux/slices/commerce/pos.js";
>>>>>>>> main:src/pages/platforms/cashier/pos/ExperimentalCashier/patientPicker/form/posCard.jsx

import {
  TIEUPS as SOURCELIST,
  RESET as SOURCERESET,
} from "./../../../../../../../services/redux/slices/assets/providers";
import {
  TIEUPS as PHYSICIANS,
  RESET as PHYSICIANRESET,
} from "./../../../../../../../services/redux/slices/assets/persons/physicians";

export default function PosCard() {
  const { collections: physicians } = useSelector(
      ({ physicians }) => physicians
    ),
    { token, onDuty } = useSelector(({ auth }) => auth),
    { category, privilege, sourceId, physicianId, customer } = useSelector(
      ({ pos }) => pos
    ),
    // { token } = useSelector(({ auth }) => auth),
    dispatch = useDispatch();

  const { collections: sources } = useSelector(({ providers }) => providers);

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

  useEffect(() => {
    if (token && onDuty?._id) {
      dispatch(SOURCELIST({ token, key: { clients: onDuty._id } }));
      dispatch(PHYSICIANS({ key: { branch: onDuty._id }, token }));

      return () => {
        dispatch(SOURCERESET());
        dispatch(PHYSICIANRESET());
      };
    }
  }, [token, dispatch, onDuty]);

  const handleCategory = (value) => {
    dispatch(SETCATEGORY(value));
  };
  const handlePreviledge = (value) => {
    dispatch(SETPRIVILEGE(value));
  };

  const handlePhysician = (value) => {
    dispatch(SETPHYSICIAN(value));
  };

  const handleSource = (value) => {
    dispatch(SETSOURCE(value));
  };

  return (
    <>
      <div className="pos-select-wrapper">
        <div className="patient-form">
          <span>Category</span>
          <select
            disabled={!didSelect}
            value={category}
            onChange={({ target }) => handleCategory(Number(target.value))}
          >
            {Categories.map(({ name }, index) => (
              <option value={index} key={`category-${index}`}>
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
            onChange={({ target }) => handlePreviledge(Number(target.value))}
          >
            {/* auto remove Senior Citizen from choices if not a valid senior */}
            {Privileges.filter((_, i) => isSenior || i !== 2).map(
              (privilege, index) => {
                let disabled = false,
                  // if privilege is greater than 0, disable all other choices
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
            value={sourceId}
            onChange={({ target }) => handleSource(target.value)}
          >
            <option value="">None</option>
            {sources?.map(({ _id, name, vendors }) => (
              <option key={_id} value={vendors?._id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="patient-form">
          <span>Physician</span>
          <select
            disabled={!didSelect}
            value={physicianId}
            onChange={({ target }) => handlePhysician(target.value)}
          >
            <option value="">None</option>
            {physicians?.map(({ user }) => (
              <option key={user?._id} value={user?._id}>
                {properFullname(user?.fullName)}
              </option>
            ))}
          </select>
        </div>
      </div>
      {_id ? (
        <div className="mt-4">
          <div className="d-flex align-items-center" style={{ gap: "60px" }}>
            <div className="pos-card-details">
              <span>Birthday</span>
              <p>{new Date(dob).toDateString()}</p>
            </div>
            <div className="pos-card-details">
              <span>Age</span>
              <p>{getAge(dob)}</p>
            </div>
          </div>
          <div className="pos-card-details">
            <span>{_mobile ? "Contact Number" : "E-mail address"}</span>
            <p>{_mobile ? mobile(_mobile) : email}</p>
          </div>
          <div className="pos-card-details">
            <span>Address</span>
            <p>{fullAddress(address)}</p>
          </div>
        </div>
      ) : (
        <MDBTypography note noteColor="info" className="mt-5">
          Please search a patron first.
        </MDBTypography>
      )}
    </>
  );
}
