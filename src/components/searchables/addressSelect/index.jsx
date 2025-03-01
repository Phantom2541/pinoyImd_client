import React from "react";
import { Philippines } from "../../../services/fakeDb";

export default function AddressSelect({
  // disabledAllExceptSelected = false,
  handleChange,
  address = { region: "", province: "", city: "", barangay: "" },
  // size = "3",
  label = "Address Information",
}) {
  const handleAddress = (key, value) => {
    const _address = { ...address };

    switch (key) {
      case "region":
        _address.region = value;
        _address.province = Philippines.initialProvince(value);
        _address.city = Philippines.initialCity(_address.province);
        break;

      case "province":
        _address.province = value;
        const cityCode = Philippines.initialCity(value);
        _address.city = cityCode;
        break;

      default:
        _address[key] = value;
        break;
    }

    handleChange("address", _address);
  };

  return (
    <>
      <div className="patient-form">
        <span>Region</span>
        <select
          value={address?.region}
          onChange={({ target }) => handleAddress("region", target.value)}
        >
          {Philippines.Regions?.map(({ name }) => (
            <option key={`${label}-reg-${name}`} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="patient-form">
        <span>Province</span>
        <select
          value={address.province}
          onChange={({ target }) => handleAddress("province", target.value)}
        >
          {Philippines.Provinces(address?.region)?.map(({ name }) => (
            <option key={`${label}-prov-${name}`} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="patient-form">
        <span>City/Municipality</span>
        <select
          value={address?.city}
          onChange={({ target }) => handleAddress("city", target.value)}
        >
          {Philippines.Cities(address.province)?.map(({ name }) => (
            <option key={`${label}-city-${name}`} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="patient-form">
        <span>Barangay</span>
        <select
          value={address?.barangay}
          onChange={({ target }) => handleAddress("barangay", target.value)}
        >
          {Philippines.Barangays(address.city)?.map(({ name }) => (
            <option key={`${label}-brgy-${name}`} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      {/* <h6 className="mb-0">{label}</h6>
      <MDBRow>
        <MDBCol md={size}>
          <CustomSelect
            choices={Philippines.Regions}
            preValue={address.region}
            onChange={(e) => handleAddress("region", e)}
            label="Region"
            values="name"
            texts="name"
            disabledAllExceptSelected={disabledAllExceptSelected}
          />
        </MDBCol>
        <MDBCol md={size}>
          <CustomSelect
            choices={Philippines.Provinces(address.region)}
            preValue={address.province}
            onChange={(e) => handleAddress("province", e)}
            label="Province"
            values="name"
            texts="name"
            disabledAllExceptSelected={disabledAllExceptSelected}
          />
        </MDBCol>
        <MDBCol md={size}>
          <CustomSelect
            choices={Philippines.Cities(address.province)}
            preValue={address.city}
            onChange={(e) => handleAddress("city", e)}
            label="City/Municipality"
            values="name"
            texts="name"
            disabledAllExceptSelected={disabledAllExceptSelected}
          />
        </MDBCol>
        <MDBCol md={size}>
          <CustomSelect
            choices={Philippines.Barangays(address.city)}
            preValue={address.barangay}
            onChange={(e) => handleAddress("barangay", e === "none" ? "" : e)}
            label="Barangay"
            values="name"
            texts="name"
            disabledAllExceptSelected={disabledAllExceptSelected}
          />
        </MDBCol>
      </MDBRow> */}
    </>
  );
}
