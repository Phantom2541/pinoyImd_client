import { References } from "../../fakeDb";
import { getDevelopment } from "../";

const findReference = (
  key = "",
  gender = false,
  dob,
  preference = "",
  preferences = []
) => {
  const getReference = (predicate) => {
    return (
      preferences.find(
        ({ serviceId, ...rest }) => serviceId === Number(key) && predicate(rest)
      ) || null
    );
  };

  const preferencePredicates = {
    equal: () => true,
    gender: ({ isMale }) => isMale === gender,
    development: ({ development }) =>
      development ===
      References.preferences.development.indexOf(getDevelopment(dob)),
  };

  if (!preferencePredicates[preference]) {
    return {
      lo: 0,
      hi: 0,
      warn: 0,
      alert: 0,
      critical: 0,
      units: "",
      _id: "",
    };
  }

  return (
    getReference(preferencePredicates[preference]) || {
      lo: 0,
      hi: 0,
      warn: 0,
      alert: 0,
      critical: 0,
      units: "",
      _id: "",
    }
  );
};

export default findReference;
