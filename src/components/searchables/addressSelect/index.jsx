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
  const handleAddress = (key, value) => {
    var _address = { ...address };
    _address[key] = value;
    _address = { ..._address, ...Philippines.initial(_address, key) };
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
              {Philippines.Provinces(address.region)?.map(({ name }) => (
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
              <option value="">-- Select Barangay --</option>
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
                _key={address.region}
                onChange={(value) => handleAddress("region", value)}
                label="Region"
                keyForValue="name"
                keyForText="name"
              />
            </MDBCol>

            <MDBCol>
              <EditableSelect
                collections={Philippines.Provinces(address.region)}
                preValue={address.province}
                _key={address.province}
                onChange={(value) => handleAddress("province", value)}
                label="Province"
                keyForValue="name"
                keyForText="name"
              />
            </MDBCol>

            <MDBCol>
              <EditableSelect
                collections={Philippines.Cities(address.province)}
                preValue={address.city}
                _key={address.city}
                onChange={(value) => handleAddress("city", value)}
                label="City/Municipality"
                keyForValue="name"
                keyForText="name"
              />
            </MDBCol>

            <MDBCol>
              <EditableSelect
                collections={Philippines.Barangays(address.city)}
                preValue={address.barangay}
                _key={address.barangay}
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
