import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MDBTypography } from "mdbreact";

import {
  fullAddress,
  getAge,
  mobile,
  properFullname,
} from "../../../../../../../services/utilities";
import { Categories, Privileges } from "../../../../../../../services/fakeDb";
import {
  TIEUPS as SOURCELIST,
  RESET as SOURCERESET,
} from "../../../../../../../services/redux/slices/assets/providers";
import {
  TIEUPS as PHYSICIANS,
  RESET as PHYSICIANRESET,
} from "../../../../../../../services/redux/slices/assets/persons/physicians";
import {
  SETCATEGORY,
  SETPRIVILEGE,
  SETPHYSICIAN,
  SETSOURCE,
} from "../../../../../../../services/redux/slices/commerce/checkout";

export default function PosCard({ selected }) {
  const { collections: physicians } = useSelector(
      ({ physicians }) => physicians
    ),
    { category, privilege, physicianId, sourceId } = useSelector(
      ({ checkout }) => checkout
    ),
    dispatch = useDispatch();
  const { collections: sources } = useSelector(({ providers }) => providers);

  const {
      dob,
      _id,
      email,
      mobile: _mobile,
      address,
      privilege: userPrivilege = 0,
    } = selected,
    didSelect = Boolean(_id),
    isSenior = getAge(dob, true) > 59; // detect if not a valid senior

  useEffect(() => {
    console.log(category, privilege, physicianId, sourceId);
  }, [category, privilege, physicianId, sourceId]);

  const handleCategory = (e) => {
    dispatch(SETCATEGORY(Number(e.target.value)));
  };
  const handlePrevilege = (e) => {
    dispatch(SETPRIVILEGE(e.target.value));
  };
  const handlePhysician = (e) => {
    dispatch(SETPHYSICIAN(e.target.value));
  };
  const handleSource = (e) => {
    dispatch(SETSOURCE(e.target.value));
  };

  return (
    <>
      <div className="pos-select-wrapper">
        <div className="patient-form">
          <span>Category</span>
          <select
            disabled={!didSelect}
            value={category}
            onChange={handleCategory}
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
            onChange={({ target }) => handlePrevilege(Number(target.value))}
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
            value={sourceId}
            onChange={handleSource}
          >
            <option value="">None</option>
            {sources?.map(({ _id, name, vendors }) => (
              <option key={_id} value={vendors?._id}>
                {name}
              </option>
            ))}
            <option
              value="register"
              style={{ fontWeight: "bold", backgroundColor: "#f0f8ff" }}
              onClick={() => handleSource("register")}
            >
              Register (Click to add a source)
            </option>
          </select>
        </div>
        <div className="patient-form">
          <span>Physician</span>
          <select
            disabled={!didSelect}
            value={physicianId}
            onChange={handlePhysician}
          >
            <option value="">None</option>
            {physicians?.map(({ user }) => (
              <option key={user?._id} value={user?._id}>
                {properFullname(user?.fullName)}
              </option>
            ))}
            <option
              value="register"
              style={{ fontWeight: "bold", backgroundColor: "#f0f8ff" }}
              onClick={() => handlePhysician("register")}
            >
              Register (Click to add a Physicians)
            </option>
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
          Please search a cient first.
        </MDBTypography>
      )}
    </>
  );
}
