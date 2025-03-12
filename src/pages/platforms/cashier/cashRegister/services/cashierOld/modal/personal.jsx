import React from "react";
import { MDBInput, MDBRow, MDBCol, MDBSwitch } from "mdbreact";
import { getAge, validateContact } from "../../../../../../services/utilities";
import { Privileges, Suffixes } from "../../../../../../services/fakeDb";
import CustomSelect from "../../../../../../components/searchables/customSelect";

export default function PersonalInformation({ handleChange, form }) {
  const { fullName, dob, mobile, isMale, privilege } = form;

  const handleFullname = (key, value) =>
    handleChange("fullName", { ...fullName, [key]: value });

  return (
    <>
      <h6 className="mb-0">Personal Information</h6>
      <MDBRow>
        <MDBCol md="3">
          <MDBInput
            type="text"
            label="Last Name"
            value={fullName.lname}
            onChange={(e) =>
              handleFullname("lname", e.target.value.toUpperCase())
            }
            required
          />
        </MDBCol>
        <MDBCol md="3">
          <MDBInput
            type="text"
            label="First Name"
            value={fullName.fname}
            onChange={(e) =>
              handleFullname("fname", e.target.value.toUpperCase())
            }
            required
          />
        </MDBCol>
        <MDBCol md="3">
          <MDBInput
            type="text"
            label="Middle Name (Optional)"
            value={fullName.mname}
            onChange={(e) =>
              handleFullname("mname", e.target.value.toUpperCase())
            }
          />
        </MDBCol>

        <MDBCol md="3">
          <CustomSelect
            label="Suffix"
            preValue={fullName.suffix || "None"}
            choices={Suffixes.map((str) => ({ str }))}
            texts="str"
            values="str"
            onChange={(e) => handleFullname("suffix", e === "None" ? "" : e)}
          />
        </MDBCol>
        <MDBCol md="3">
          <MDBInput
            type="text"
            label="Contact Number (+63)"
            value={mobile}
            maxLength={10}
            onKeyDown={validateContact}
            onChange={(e) => handleChange("mobile", e.target.value)}
          />
        </MDBCol>
        <MDBCol md="3">
          <MDBInput
            type="date"
            label={`Birthday (${getAge(dob)})`}
            value={dob}
            onChange={(e) => handleChange("dob", e.target.value)}
            required
          />
        </MDBCol>
        <MDBCol md="3">
          <CustomSelect
            disableByKey={{
              str: getAge(dob, true) < 60 ? "Senior Citizen" : "",
            }}
            label="Privilege"
            preValue={String(privilege)}
            choices={Privileges.map((p, i) => ({ str: p, index: i }))}
            texts="str"
            values="index"
            onChange={(e) => handleChange("privilege", Number(e))}
          />
        </MDBCol>
        <MDBCol md="3" className="text-center">
          <MDBSwitch
            checked={isMale}
            onChange={() => handleChange("isMale", !isMale)}
            labelLeft="Female"
            labelRight="Male"
            className="mt-4"
          />
        </MDBCol>
      </MDBRow>
    </>
  );
}
