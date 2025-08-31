import regions from "./regions.json";
import provinces from "./provinces.json";
import cities from "./city-mun.json";
import barangays from "./barangays.json";

const adressLevels = [regions, provinces, cities, barangays];

const filter = (lvl, codeKey, code) => {
  return (
    adressLevels[lvl]
      ?.filter((address) => address[codeKey] === code)
      .sort((a, b) => a.name.localeCompare(b.name)) || []
  );
};

const getName = (collections, value) => {
  return collections.some(({ name }) => name === value)
    ? value
    : collections[0]?.name;
};
const Philippines = {
  Regions: regions,
  initial: (address, notInclude) => {
    const { region = regions[2].name, province = "", city = "" } = address;
    const provinces = Philippines.Provinces(region);
    const provinceName = getName(provinces, province);
    const cities = Philippines.Cities(provinceName);
    const cityName = getName(cities, city);
    const barangays = Philippines.Barangays(cityName);

    const defaultAddress = {
      region,
      province: provinceName,
      city: cityName,
      barangay: barangays[0]?.name,
    };

    const hierarchy = ["region", "province", "city", "barangay"];
    return hierarchy
      .slice(hierarchy.indexOf(notInclude) + 1)
      .reduce((obj, key) => ({ ...obj, [key]: defaultAddress[key] }), {});
  },
  Provinces: (_name) => {
    const region = regions?.find(({ name }) => name === _name);
    return filter(1, "reg_code", region?.code);
  },
  Cities: (province) => {
    const prov_code = provinces?.find(({ name }) => name === province)?.code;
    return filter(2, "prov_code", prov_code);
  },
  Barangays: (city) => {
    const mun_code = cities?.find(({ name }) => name === city)?.code;
    return filter(3, "mun_code", mun_code);
  },
};

export default Philippines;
