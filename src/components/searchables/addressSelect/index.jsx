import { useState, useEffect } from "react";
import { Philippines } from "../../../services/fakeDb";
import { MDBCol, MDBRow } from "mdbreact";
import EditableSelect from "../../customizable/editableSelect";

export default function AddressSelect({
  handleChange = () => {},
  required = false,
  address = { region: "", province: "", city: "", barangay: "" },
  label = "Address Information",
  isPOS = true,
}) {
  console.log("initial address", address);

  const [provObj, setProvObj] = useState({});
  const [munObj, setMunObj] = useState({});
  const [ProvinceCollections, setProvinceCollections] = useState([]);
  const [CityCollections, setCityCollections] = useState([]);
  const [BrgyCollections, setBrgyCollections] = useState([]);

  // ✅ preload collections when editing or when address already has values
  useEffect(() => {
    if (address?.region) {
      console.log("useEffect region :", address);
      const _Provinces = Philippines.Provinces(address?.region);
      const _Cities = Philippines.Cities(_Provinces[0]);
      const _Brgys = Philippines.Barangays(_Cities[0].code);
      setProvinceCollections(_Provinces);
      setCityCollections(_Cities);
      setBrgyCollections(_Brgys);
    }
  }, [address.region]);

  useEffect(() => {
    if (provObj.code) {
      const _Cities = Philippines.Cities(provObj);
      const _Brgys = Philippines.Barangays(_Cities[0].code);
      setCityCollections(_Cities);
      setBrgyCollections(_Brgys);
    }
  }, [provObj]);

  useEffect(() => {
    if (munObj) {
      const _Brgys = Philippines.Barangays(munObj.code);
      setBrgyCollections(_Brgys);
    }
  }, [munObj]);

  const handleAddress = (key, value) => {
    const _address = { ...address };

    if (key === "region") {
      _address.region = value;
      console.log("handleAddress region :", value);
      const _Provinces = Philippines.Provinces(value);
      const _Cities = Philippines.Cities(_Provinces[0]);
      const _Brgys = Philippines.Barangays(_Cities[0].code);

      _address.province = _Provinces[0]?.name || "";
      _address.city = _Cities[0]?.name || "";
      _address.barangay = _Brgys[0]?.name || "";
    } else if (key === "province") {
      _address.province = value;
      const _Province = ProvinceCollections.find(({ name }) => name === value);
      console.log("Province", _Province);

      const _Cities = Philippines.Cities(_Province);
      const _Brgys = Philippines.Barangays(_Cities[0].code);

      _address.city = _Cities[0]?.name || "";
      _address.barangay = _Brgys[0]?.name || "";
      setProvObj(_Province);
      setMunObj(_Cities[0]);
    } else if (key === "city") {
      _address.city = value;
      const _city = CityCollections.find(({ name }) => name === value);
      const _Brgys = Philippines.Barangays(_city.code);
      _address.barangay = _Brgys[0]?.name || "";
      setMunObj(_city);
    } else {
      _address[key] = value;
    }

    handleChange("address", _address);
  };

  return (
    <>
      {isPOS ? (
        <>
          <div className="patient-form">
            <span>Region</span>
            <select
              value={address?.region}
              required={required}
              onChange={({ target }) => handleAddress("region", target.value)}
            >
              <option value="">-- Select Region --</option>
              {Philippines.Regions?.map(({ name }) => (
                <option key={`${label}-reg-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="patient-form mt-1">
            <span>Province</span>
            <select
              value={address.province}
              required={required}
              onChange={({ target }) => handleAddress("province", target.value)}
            >
              <option value="">-- Select Province --</option>
              {ProvinceCollections?.map(({ name }) => (
                <option key={`${label}-prov-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="patient-form mt-1">
            <span>City/Municipality</span>
            <select
              value={address?.city}
              required={required}
              onChange={({ target }) => handleAddress("city", target.value)}
            >
              <option value="">-- Select City/Municipality --</option>
              {CityCollections?.map(({ name }) => (
                <option key={`${label}-city-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="patient-form mt-1">
            <span>Barangay</span>
            <select
              value={address?.barangay}
              required={required}
              onChange={({ target }) => handleAddress("barangay", target.value)}
            >
              <option value="">-- Select Barangay --</option>
              {BrgyCollections?.map(({ name }) => (
                <option key={`${label}-brgy-${name}`} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <>
          <h6 className="mb-3">{label}</h6>
          <MDBRow>
            <MDBCol>
              <EditableSelect
                collections={Philippines.Regions}
                isCapitalize={false}
                preValue={address.region}
                onChange={(value) => handleAddress("region", value)}
                label="Region"
                keyForValue="name"
                keyForText="name"
              />
            </MDBCol>

            <MDBCol>
              <EditableSelect
                collections={ProvinceCollections}
                preValue={address.province}
                onChange={(value) => handleAddress("province", value)}
                label="Province"
                keyForValue="name"
                keyForText="name"
              />
            </MDBCol>

            <MDBCol>
              <EditableSelect
                collections={CityCollections}
                preValue={address.city}
                onChange={(value) => handleAddress("city", value)}
                label="City/Municipality"
                keyForValue="name"
                keyForText="name"
              />
            </MDBCol>

            <MDBCol>
              <EditableSelect
                collections={BrgyCollections}
                preValue={address.barangay}
                onChange={(value) => handleAddress("barangay", value)}
                label="Barangay"
                keyForValue="name"
                keyForText="name"
              />
            </MDBCol>
          </MDBRow>
        </>
      )}
    </>
  );
}
