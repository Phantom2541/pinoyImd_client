import { MDBTypography } from "mdbreact";
import React from "react";
import {
  fullAddress,
  getAge,
  mobile,
  properFullname,
} from "../../../../../../../services/utilities";
import { Categories, Privileges } from "../../../../../../../services/fakeDb";
import { useSelector } from "react-redux";

export default function PosCard({
  selected,
  setCategoryIndex,
  categoryIndex,
  privilegeIndex,
  setPrivilegeIndex,
  setPhysicianId,
  physicianId,
  setSourceId,
  sourceId,
}) {
  const { collections: physicians } = useSelector(
    ({ physicians }) => physicians
  );
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

  return (
    <>
      <div className="pos-select-wrapper">
        <div className="patient-form">
          <span>Category</span>
          <select
            disabled={!didSelect}
            value={categoryIndex}
            onChange={({ target }) => setCategoryIndex(Number(target.value))}
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
            value={privilegeIndex}
            onChange={({ target }) => setPrivilegeIndex(Number(target.value))}
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
            onChange={({ target }) => setSourceId(target.value)}
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
            onChange={({ target }) => setPhysicianId(target.value)}
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
