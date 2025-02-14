import React from "react";
import { MDBRow, MDBCol, MDBInput, MDBBtn, MDBSwitch } from "mdbreact";
// import AddressSelect from "../addressSelect";
import CustomSelect from "../customSelect";
import { Suffixes } from "../../services/fakeDb";
import { getAge } from "../../services/utilities";
import ProfileOthers from "./others";

export default function Details({
  address,
  setAddress,
  form,
  handleChange,
  handleSubmit,
  isLoading,
  curraddress,
  setCurraddress,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <MDBRow>
        <MDBCol md="4" className="pr-0">
          <MDBInput
            type="text"
            value={form.fullName?.fname}
            onChange={(e) =>
              handleChange("fullName", {
                ...form.fullName,
                fname: e.target.value.toUpperCase(),
              })
            }
            label="First name"
            disabled
          />
        </MDBCol>
        <MDBCol md="4" className="px-0">
          <MDBInput
            type="text"
            value={form.fullName?.mname}
            onChange={(e) =>
              handleChange("fullName", {
                ...form.fullName,
                mname: e.target.value.toUpperCase(),
              })
            }
            label="Middle name"
            disabled
          />
        </MDBCol>
        <MDBCol md="4" className="pl-0">
          <MDBInput
            type="text"
            value={form.fullName?.lname}
            onChange={(e) =>
              handleChange("fullName", {
                ...form.fullName,
                lname: e.target.value.toUpperCase(),
              })
            }
            label="Last name"
            disabled
          />
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol md="4" className="pr-0">
          <MDBInput
            type="text"
            value={form.fullName?.title}
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
            value={form.fullName?.postnominal}
            onChange={(e) =>
              handleChange("fullName", {
                ...form.fullName,
                postnominal: e.target.value,
              })
            }
            label="Postnominal"
          />
        </MDBCol>
        <MDBCol md="4" style={{ paddingTop: "2px" }} className="pl-0">
          <CustomSelect
            label="Suffix"
            preValue={form.fullName?.suffix || "None"}
            choices={Suffixes.map((str) => ({ str }))}
            texts="str"
            values="str"
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
        <MDBCol md="3" className="pr-0" style={{ paddingTop: "14px" }}>
          <MDBInput
            type="date"
            value={form.dob}
            onChange={(e) => handleChange("dob", e.target.value)}
            labelClass=""
            className="py-0"
            label={`Birthdate (${getAge(form.dob)})`}
            disabled
          />
        </MDBCol>
        <MDBCol md="4" className="px-0">
          <MDBInput
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            label="E-mail Address"
            disabled
          />
        </MDBCol>
        <MDBCol md="2" className="px-0">
          <MDBInput
            type="text"
            value={form.mobile}
            onChange={(e) =>
              handleChange("mobile", e.target.value.replace(/\D/g, ""))
            }
            label="Mobile (+63)"
            maxLength={10}
          />
        </MDBCol>
        <MDBCol md="3" className="text-center">
          <MDBSwitch
            checked={form.isMale}
            onChange={() => handleChange("isMale", !form.isMale)}
            labelLeft="Female"
            labelRight="Male"
            className="mt-4"
            disabled
          />
        </MDBCol>
      </MDBRow>
      address disabled
      {/* <AddressSelect
        label="Permanent Address"
        address={address}
        disabledAllExceptSelected={true}
        handleChange={(_, value) => setAddress(value)}
      /> */}
      <MDBCol className="px-0">
        <MDBInput
          type="text"
          label="Street"
          value={address.street}
          onChange={(e) => setAddress({ ...address, street: e.target.value })}
          disabled
        />
      </MDBCol>
      address disabled
      {/* <AddressSelect
        label="Current Address"
        address={curraddress}
        handleChange={(_, value) => setCurraddress(value)}
      /> */}
      <MDBCol className="px-0">
        <MDBInput
          type="text"
          label="Street"
          value={curraddress.street}
          onChange={(e) =>
            setCurraddress({ ...curraddress, street: e.target.value })
          }
        />
      </MDBCol>
      <div className="d-flex justify-content-between">
        <ProfileOthers />
        <MDBBtn disabled={isLoading} color="info" type="submit" rounded>
          Update account
        </MDBBtn>
      </div>
    </form>
  );
}
