import { MDBRow, MDBCol, MDBInput, MDBBtn, MDBSwitch } from "mdbreact";
import { EditableUser, Select } from "../customizable";
import { Suffixes } from "../../services/fakeDb";
import { getAge } from "../../services/utilities";
import ProfileOthers from "./others";
import AddressSelect from "../searchables/addressSelect";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { UPDATE } from "../../services/redux/slices/assets/persons/auth";

export default function Guardian({
  address,
  setAddress,
  form,
  handleChange,
  handleSubmit,
  isLoading,
}) {
  const { auth, isSuccess, formSubmitted, token } = useSelector(
    ({ auth }) => auth
  );
  const dispatch = useDispatch();
  const { guardian = {} } = auth;
  console.log("nick", auth);

  // local state (if you plan to use this later)
  // const [primary, setPrimary] = useState(null);

  const handleUpdate = ({ _id, key, value }) => {
    console.log("selected", { _id, [key]: value });

    // build payload here if needed
    let data = { _id, [key]: value };
    console.log("Updating guardian:", data);
    dispatch(UPDATE({ token, data }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <MDBRow>
        <MDBCol md="3">
          <MDBInput
            type="text"
            value={form.guardian.fullName?.fname?.toUpperCase() || ""}
            onChange={(e) =>
              handleChange(
                "guardian.fullName.fname",
                e.target.value.toUpperCase()
              )
            }
            label="Guardian First name"
          />
        </MDBCol>
        <MDBCol md="3" className="px-0">
          <MDBInput
            disabled
            type="text"
            value={form.fullName?.mname?.toUpperCase() || ""}
            onChange={(e) =>
              handleChange("fullName", {
                ...form.fullName,
                mname: e.target.value.toUpperCase(),
              })
            }
            label="Middle name"
          />
        </MDBCol>
        <MDBCol md="3">
          <MDBInput
            type="text"
            disabled
            value={form.fullName?.lname?.toUpperCase() || ""}
            onChange={(e) =>
              handleChange("fullName", {
                ...form.fullName,
                lname: e.target.value.toUpperCase(),
              })
            }
            label="Last name"
          />
        </MDBCol>
        <MDBCol md="3">
          <MDBInput
            type="text"
            value={form?.alias?.toUpperCase() || ""}
            onChange={(e) => handleChange("alias", e.target.value)}
            label="Alias"
          />
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol md="4">
          <MDBInput
            type="text"
            value={form.fullName?.title?.toUpperCase() || ""}
            onChange={(e) =>
              handleChange("fullName", {
                ...form.fullName,
                title: e.target.value,
              })
            }
            label="Title"
          />
        </MDBCol>
        <MDBCol md="4" className="px-0">
          <MDBInput
            type="text"
            value={form.fullName?.postnominal?.toUpperCase() || ""}
            onChange={(e) =>
              handleChange("fullName", {
                ...form.fullName,
                postnominal: e.target.value,
              })
            }
            label="Postnominal"
          />
        </MDBCol>
        <MDBCol md="4" style={{ paddingTop: "2px" }}>
          <Select
            label="Suffix"
            preValue={form.fullName?.suffix || "None"}
            collections={Suffixes}
            onChange={(e) =>
              handleChange("fullName", {
                ...form.fullName,
                suffix: e === "None" ? "" : e,
              })
            }
            disabledAllExceptSelected
          />
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <label>Primary Contact: </label>
        <EditableUser
          user="k"
          placeHolder="Contact..."
          keyforValue="${properFullName(guardian.fullName)}"
          formSubmitted={formSubmitted}
          isSuccess={isSuccess}
          onSave={(data) => {
            handleUpdate({
              _id: auth._id,
              key: "guardian",
              value: data,
            });
          }}
        />
      </MDBRow>

      <MDBRow>
        <MDBCol md="3" style={{ paddingTop: "14px" }}>
          <MDBInput
            type="date"
            value={form.dob || ""}
            disabled
            onChange={(e) => handleChange("dob", e.target.value)}
            className="py-0"
            label={`Birthdate (${getAge(form.dob)})`}
          />
        </MDBCol>
        <MDBCol md="4">
          <MDBInput
            type="email"
            value={form.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            label="E-mail Address"
            disabled
          />
        </MDBCol>
        <MDBCol md="2">
          <MDBInput
            type="text"
            value={form.mobile || ""}
            disabled
            onChange={(e) =>
              handleChange("mobile", e.target.value.replace(/\D/g, ""))
            }
            label="Mobile (+63)"
            maxLength={10}
          />
        </MDBCol>
        <MDBCol md="3" className="text-center">
          <MDBSwitch
            checked={!!form.isMale}
            onChange={() => handleChange("isMale", !form.isMale)}
            labelLeft="Female"
            labelRight="Male"
            className="mt-4"
            disabled
          />
        </MDBCol>
      </MDBRow>

      <AddressSelect
        label="Address"
        isPOS={false}
        address={address}
        disabledAllExceptSelected={true}
        handleChange={(_, value) => setAddress(value)}
      />

      <div className="d-flex justify-content-between mt-2">
        <ProfileOthers />
        <MDBBtn disabled={isLoading} color="info" type="submit" rounded>
          Update account
        </MDBBtn>
      </div>
    </form>
  );
}
