import regions from "./regions.json";
import provinces from "./provinces.json";
import cities from "./city-mun.json";
import barangays from "./barangays.json";

// const initial = [regions, provinces, cities, barangays];

const Philippines = {
  Regions: regions,
  Provinces: (_name) => {
    console.log("Provinces name :", _name);

    const region = regions?.find(({ name }) => name === _name);

    console.log("Provinces region :", region);
    return provinces
      ?.filter(({ reg_code }) => reg_code === region.code)
      .sort((a, b) => a.name.localeCompare(b.name));
  },
  Cities: (province) =>
    cities
      ?.filter(({ prov_code }) => prov_code === province.code)
      .sort((a, b) => a.name.localeCompare(b.name)),
  Barangays: (code) =>
    barangays
      ?.filter(({ mun_code }) => mun_code === code)
      .sort((a, b) => a.name.localeCompare(b.name)),
};

export default Philippines;
