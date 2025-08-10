import { Philippines } from "../../../services/fakeDb";
import { MDBCol, MDBRow } from "mdbreact";
import EditableSelect from "../../customizable/editableSelect";

export default function AddressSelect({
  // disabledAllExceptSelected = false,
  handleChange,
  required = false,
  address = { region: "", province: "", city: "", barangay: "" },
  // size = "3",
  label = "Address Information",
  isPOS = true,
}) {
  const handleAddress = (key, value) => {
    const _address = { ...address };

    switch (key) {
      case "region":
        _address.region = value;
        _address.province = Philippines.initialProvince(value);
        const city = Philippines.initialCity(_address.province);
        _address.city = city;
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
      {isPOS ? (
        <>
          {" "}
          <div className="patient-form">
            <span>Region</span>
            <select
              value={address?.region}
              required={required}
              onChange={({ target }) => handleAddress("region", target.value)}
            >
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
              {Philippines.Provinces(address?.region)?.map(({ name }) => (
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
              {Philippines.Cities(address.province)?.map(({ name }) => (
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
              {Philippines.Barangays(address.city)?.map(({ name }) => (
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
                onChange={(e) => handleAddress("region", e)}
                label="Region"
                keyForValue="name"
                keyForText="name"
              />
            </MDBCol>
            <MDBCol>
              <EditableSelect
                collections={Philippines.Provinces(address.region)}
                preValue={address.province}
                onChange={(e) => handleAddress("province", e)}
                label="Province"
                keyForValue="name"
                keyForText="name"
              />
            </MDBCol>
            <MDBCol>
              <EditableSelect
                collections={Philippines.Cities(address.province)}
                preValue={address.city}
                onChange={(e) => handleAddress("city", e)}
                label="City/Municipality"
                keyForValue="name"
                keyForText="name"
              />
            </MDBCol>
            <MDBCol>
              <EditableSelect
                collections={Philippines.Barangays(address.city)}
                preValue={address.barangay}
                onChange={(e) =>
                  handleAddress("barangay", e === "none" ? "" : e)
                }
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
