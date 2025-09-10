import { useEffect, useState } from "react";
import { Privileges, Suffixes } from "../../../../../../../../services/fakeDb";
import {
  generateEmail,
  getAge,
  validateContact,
} from "../../../../../../../../services/utilities";
import AddressSelect from "../../../../../../../../components/searchables/addressSelect";
import { useSelector } from "react-redux";
import { MDBBtn, MDBIcon, MDBInput } from "mdbreact";

const Register = ({ setIsRegister, form, setForm }) => {
  const { activePlatform } = useSelector(({ auth }) => auth);
  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  useEffect(() => {
    setForm((prev) => ({ ...prev, address: activePlatform?.branch?.address }));
  }, [activePlatform, setForm]);

  const {
    fullName = {},
    dob,
    privilege,
    mobile,
    isMale,
    address,
    email,
  } = form;
  return (
    <>
      <MDBBtn
        className="float-right px-2 mt-n3 ml-n5 py-1 zIndex-2 "
        size="sm"
        color="danger"
        rounded
        onClick={() => setIsRegister(false)}
        title="Search again..."
      >
        <MDBIcon icon="times" style={{ fontSize: "12px" }} />
      </MDBBtn>
      <div className="patient-personal-container mt-1">
        <div className="patient-personal-info" data-title="Fullname">
          <div className="patient-form">
            <span>Last Name</span>
            <input
              type="text"
              value={fullName?.lname?.toUpperCase() || ""}
              onChange={({ target }) =>
                handleChange("fullName", {
                  ...fullName,
                  lname: target.value.toUpperCase(),
                })
              }
              required
            />
          </div>
          <div className="patient-form">
            <span>First Name</span>
            <input
              type="text"
              value={fullName?.fname?.toUpperCase() || ""}
              onChange={({ target }) =>
                handleChange("fullName", {
                  ...fullName,
                  fname: target.value.toUpperCase(),
                })
              }
              required
            />
          </div>
          <div className="patient-form">
            <span>Middle Name (Optional)</span>
            <input
              type="text"
              value={fullName?.mname?.toUpperCase() || ""}
              onChange={({ target }) =>
                handleChange("fullName", {
                  ...fullName,
                  mname: target.value.toUpperCase(),
                })
              }
            />
          </div>
          <div className="patient-form">
            <span>Suffix</span>
            <select
              value={fullName?.suffix || ""}
              onChange={({ target }) =>
                handleChange("fullName", {
                  ...fullName,
                  suffix: target.value === "None" ? "" : target.value,
                })
              }
            >
              {Suffixes.map((sfx) => (
                <option key={sfx} value={sfx}>
                  {sfx}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="patient-personal-info border-none">
          <div className="patient-form">
            <span>Birthday ({getAge(dob)})</span>
            <input
              type="date"
              value={dob || ""}
              onChange={({ target }) => {
                // if age is greater than 59, automatically set privilege
                const data = {
                  dob: target.value,
                  privilege: 0,
                };

                if (getAge(target.value, true) > 59) data.privilege = 2;

                setForm({ ...form, ...data });
                // handleChange("dob", target.value)
              }}
              required
            />
          </div>
          <div className="patient-form">
            <span>Privilege</span>
            <select
              disabled={getAge(dob, true) > 59}
              value={privilege}
              onChange={({ target }) =>
                handleChange("privilege", Number(target.value))
              }
            >
              {Privileges?.map((privilege, index) => {
                const isDisabled =
                  privilege === "Senior Citizen" && getAge(dob, true) < 60;

                return (
                  <option
                    disabled={isDisabled}
                    key={`priv-${privilege}`}
                    value={index}
                  >
                    {privilege}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="patient-form">
            <span>Contact Number (+63)</span>
            <input
              type="text"
              maxLength={10}
              onKeyDown={validateContact}
              value={mobile || ""}
              onChange={({ target }) => handleChange("mobile", target.value)}
            />
          </div>
          <div className="patient-form">
            <span>Gender</span>
            <div className="d-flex" style={{ gap: "20px" }}>
              <input
                checked={!isMale}
                onChange={() => handleChange("isMale", false)}
                className="form-check-input"
                type="checkbox"
                id="Female"
              />
              <label
                htmlFor="Female"
                className="form-check-label label-table pl-4"
              >
                Female
              </label>
              <input
                checked={isMale}
                onChange={() => handleChange("isMale", true)}
                className="form-check-input"
                type="checkbox"
                id="Male"
              />
              <label
                htmlFor="Male"
                className="form-check-label label-table pl-4"
              >
                Male
              </label>
            </div>
          </div>
        </div>
      </div>
      <div
        className="patient-personal-info address-grid mt-4"
        data-title="Address Information"
      >
        <AddressSelect address={address} handleChange={handleChange} />
        <div className="patient-form full-width">
          <span>Street (Optional)</span>
          <input
            type="text"
            value={address?.street}
            onChange={({ target }) =>
              handleChange("address", { ...address, street: target.value })
            }
          />
        </div>
      </div>
      <MDBInput
        label="Email (Optional)"
        type="email"
        className="pb-0"
        onChange={({ target }) => handleChange("email", target.value)}
        value={email || generateEmail(form)}
      />
    </>
  );
};

export default Register;
