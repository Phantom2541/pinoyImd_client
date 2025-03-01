import { MDBBtn } from "mdbreact";
import React, { useEffect, useState } from "react";
import { Privileges, Suffixes } from "../../../../../../../services/fakeDb";
import {
  generateEmail,
  getAge,
  validateContact,
} from "../../../../../../../services/utilities";
import AddressSelect from "../../../../../../../components/searchables/addressSelect";
import {
  SAVE,
  UPDATE,
} from "../../../../../../../services/redux/slices/assets/persons/users";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";

const _form = {
  fullName: {
    fname: "",
    mname: "",
    lname: "",
    suffix: "",
  },
  address: {
    region: "REGION III (CENTRAL LUZON)",
    province: "NUEVA ECIJA",
    city: "CABANATUAN CITY",
    barangay: "",
    street: "",
  },
  dob: "",
  isMale: false,
  mobile: "",
  privilege: 0,
};

export default function Patient({ injectName }) {
  const [form, setForm] = useState(_form),
    { token } = useSelector(({ auth }) => auth),
    { customer } = useSelector(({ pos }) => pos),
    dispatch = useDispatch();

  // inject searched name if no match
  useEffect(() => {
    if (injectName) {
      const [lname, rest = ""] = injectName.toUpperCase().split(", "),
        [fname = "", mname = ""] = rest.split(" Y ");

      setForm((prev) => ({
        ...prev,
        fullName: {
          ...prev.fullName,
          fname,
          lname,
          mname,
        },
      }));
    }
  }, [injectName]);

  // update form for selected user
  useEffect(() => {
    setForm(customer?._id ? customer : _form);
  }, [customer]);

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const { fullName, _id, dob, privilege, mobile, isMale, address } = form;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (_id) {
      // update
      if (!isEqual(form, customer))
        dispatch(
          UPDATE({
            data: form,
            token,
          })
        );
    } else {
      // create
      dispatch(
        SAVE({
          data: { ...form, password: "password", email: generateEmail(form) },
          token,
        })
      );
    }

    setForm(_form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="patient-personal-container">
        <div className="patient-personal-info" data-title="Fullname">
          <div className="patient-form">
            <span>Last Name</span>
            <input
              type="text"
              value={fullName?.lname}
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
              value={fullName?.fname}
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
              value={fullName?.mname}
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
              value={fullName?.suffix}
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
              value={dob}
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
              value={mobile}
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
      <MDBBtn
        type="submit"
        color={_id ? "info" : "primary"}
        className="float-right mt-4"
      >
        {_id ? "Update" : "Create"}
      </MDBBtn>
    </form>
  );
}
