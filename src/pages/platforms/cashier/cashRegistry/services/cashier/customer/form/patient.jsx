import { MDBBtn, MDBInput } from "mdbreact";
import { useEffect, useState } from "react";
import { useToasts } from "react-toast-notifications";

import { Privileges, Suffixes } from "../../../../../../../../services/fakeDb";
import {
  generateEmail,
  getAge,
  validateContact,
} from "../../../../../../../../services/utilities";
import AddressSelect from "../../../../../../../../components/searchables/addressSelect";
import {
  DUPLICATE_CHECKER,
  SAVE,
  UPDATE,
} from "../../../../../../../../services/redux/slices/assets/persons/users";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";
import { SETPATIENT } from "../../../../../../../../services/redux/slices/commerce/pos/services/pos";
import Swal from "sweetalert2";
import Spinner from "../../../../../../../../components/spinner";

/**
 * if user is not in quest, use branch address
 * else use user quest addres
 */

export default function Patient({
  setActiveIndex,
  setShowPatientInfo = () => {},
}) {
  const { token } = useSelector(({ auth }) => auth),
    { formSubmitted } = useSelector(({ users }) => users),
    { customer } = useSelector(({ pos }) => pos),
    [form, setForm] = useState({}),
    dispatch = useDispatch(),
    { addToast } = useToasts();

  // inject searched name if no match
  useEffect(() => {
    if (customer) {
      const { address = {} } =
        JSON.parse(localStorage.getItem("activePlatform"))?.branch || {};

      const _address = customer?.address?.province
        ? customer.address
        : {
            region: address?.region || "",
            province: address?.province || "",
            city: address?.city || "",
            barangay: "",
            street: "",
          };

      const _form = {
        ...customer,
        address: _address,
      };

      setForm(_form);
    }
  }, [customer]);
  // update form for selected user

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const {
    fullName = {},
    _id,
    dob,
    privilege,
    mobile,
    isMale,
    address,
    email,
  } = form;

  const isDuplicate = async (data) => {
    return await dispatch(DUPLICATE_CHECKER(data)).then((action) => {
      switch (action.type) {
        case "assets/persons/users/duplicate_checker/fulfilled":
          return false;
        case "assets/persons/users/duplicate_checker/rejected":
          const { error } = action;
          Swal.fire({
            title: "Ooops...",
            text: error?.message,
            icon: "error",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Okay, I understand.",
          });
          return true;

        default:
          return true;
      }
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const _form = { ...form };
    if (_id) {
      // update
      if (!isEqual(_form, customer)) {
        const duplicate = await isDuplicate({
          data: _form,
          token,
        });
        if (!duplicate) {
          dispatch(
            UPDATE({
              data: _form,
              token,
            })
          ).then((action) => {
            if (action.type === "assets/persons/users/update/fulfilled") {
              dispatch(SETPATIENT(action.payload.payload));
              setActiveIndex(0);
              return addToast("Successfully updated patient.", {
                appearance: "success",
              });
            }
          });
        }
      } else {
        return addToast("No changes found, skipping update.", {
          appearance: "info",
        });
      }
    } else {
      const body = {
        data: {
          ..._form,
          password: form?.dob.replaceAll("-", ""),
          email: email || generateEmail(_form),
          activePlatform: {
            isPatient: true,
            isCeo: false,
            platform: "patron",
            role: "patron",
          },
        },
        token,
      };
      const duplicate = await isDuplicate(body);
      if (!duplicate) {
        dispatch(SAVE(body)).then((action) => {
          if (action.type === "assets/persons/users/save/fulfilled") {
            dispatch(SETPATIENT(action?.payload?.payload));
            setShowPatientInfo(true);
            setActiveIndex(0);
            return addToast("Successfully registered patient.", {
              appearance: "success",
            });
          }
        });
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="patient-personal-container">
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

      <MDBBtn
        type="submit"
        color={_id ? "info" : "primary"}
        className="float-right mt-n2"
        disabled={formSubmitted}
      >
        {_id ? "Update" : "Register"} <Spinner formSubmitted={formSubmitted} />
      </MDBBtn>
    </form>
  );
}
