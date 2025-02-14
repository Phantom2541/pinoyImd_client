import regions from "./regions.json";
import provinces from "./provinces.json";
import cities from "./city-mun.json";
import barangays from "./barangays.json";

const initial = [regions, provinces, cities, barangays];

const filter = (index, key, value) => {
  const { code } = initial[index - 1].find(({ name }) => name === value);
  return initial[index].filter(i => i[key] === code);
};

const Philippines = {
  Regions: regions,
  Provinces: name => filter(1, "reg_code", name),
  Cities: name => filter(2, "prov_code", name),
  Barangays: name => filter(3, "mun_code", name),

  initialProvince: rname => {
    const rid = regions.find(({ name }) => name === rname).code;
    return provinces.filter(({ reg_code }) => reg_code === rid)[0].name;
  },
  initialCity: pname => {
    const pid = provinces.find(({ name }) => name === pname).code;
    return cities.filter(({ prov_code }) => prov_code === Number(pid))[0].name;
  },
};

export default Philippines;
