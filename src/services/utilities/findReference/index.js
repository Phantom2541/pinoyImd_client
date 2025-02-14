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
    console.log("predicate", predicate);

    const testPref = preferences.find(({ serviceId }) => serviceId === 23);
    console.log(testPref);

    if (testPref) {
      console.log(testPref);
    }

    const returnValue = preferences.find(
      ({ serviceId, ...rest }) => serviceId === Number(key) && predicate(rest)
    );

    console.log(returnValue);

    return returnValue;
  };

  const preferencePredicates = {
    equal: () => true,
    gender: ({ isMale }) => isMale === gender,
    development: ({ development }) =>
      development ===
      References.preferences.development.indexOf(getDevelopment(dob)),
  };

  if (preference === "development") console.log(key);

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
