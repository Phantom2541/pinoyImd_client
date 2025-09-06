import provinces from "../../../services/fakeDb/finance/philippines/provinces.json";
const fullAddress = (address, isComplete = true) => {
  if (typeof address !== "object") return <i>Datatype mismatch</i>;

  const { region, province, city, barangay, street = "" } = address;

  if (isComplete)
    return `${street && `${street},`} ${
      barangay && `${barangay},`
    } ${city}, ${province}, ${region}`.replace(/^\s+|\s+$/gm, "");

  return `${street && `${street}, `}${
    barangay && `${barangay}, `
  }${city}, ${province}`.replace(/^\s+|\s+$/gm, "");
};
const billingAddress = (address) => {
  if (typeof address !== "object") return <i>Datatype mismatch</i>;
  const { province, city, barangay } = address;
  return `${barangay} , ${city}, ${
    provinces.find((p) => p.name === province)?.abbrev
  } `;
};

const cleanLocationName = (location) =>
  location
    .replace(/\(.*?\)/g, "") // remove (Pob.) or any ()
    .replace(/\bI{1,3}\b$/g, "") // remove Roman numerals I, II, III at end
    .trim();

const LatitudeAddress = (address) => {
  var { barangay, city, province } = address;

  return `${`${cleanLocationName(barangay)},`}${cleanLocationName(
    city
  )}, ${cleanLocationName(province)}, philippines`.replace(/^\s+|\s+$/gm, "");
};

export { billingAddress, fullAddress, LatitudeAddress };
