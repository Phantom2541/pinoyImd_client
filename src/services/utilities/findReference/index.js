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
    console.log("predicate :", predicate);
    console.log("key :", key);
    console.log("preferences :", preferences);

    let references = {};
    switch (preference) {
      case "gender":
        references =
          preferences.find(({ isMale }) => isMale === gender) || null;
        break;
      case "development":
        references =
          preferences.find(({ development }) => development === Number(key)) ||
          null;

        break;
      default:
        references = preferences[0];
        break;
    }

    return references;
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
