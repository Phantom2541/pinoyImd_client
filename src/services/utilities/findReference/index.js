// import { References } from "../../fakeDb";
// import { getDevelopment } from "../";

// const DEFAULT_REFERENCE = {
//   lo: 0,
//   hi: 0,
//   warn: 0,
//   alert: 0,
//   critical: 0,
//   units: "",
//   _id: "",
// };

const findReference = (
  key,
  gender = false,
  dob,
  preference = "",
  preferences = []
) => {
  const getReference = () => {
    let references = {};
    switch (preference) {
      case "gender":
        references =
          preferences.find(
            ({ serviceId, isMale }) =>
              serviceId === Number(key) && isMale === gender
          ) || null;

        break;
      case "development":
        references =
          preferences.find(({ serviceId }) => serviceId === Number(key)) ||
          null;

        break;
      default:
        references =
          preferences.find(({ serviceId }) => serviceId === Number(key)) ||
          null;

        break;
    }

    return references;
  };

  return (
    getReference() || {
      lo: 0,
      hi: 0,
      warn: 0,
      alert: 0,
      critical: 0,
      units: "",
      _id: "",
    }
  );
  // if (!Array.isArray(preferences) || preferences.length === 0) {
  //   return DEFAULT_REFERENCE;
  // }

  // const predicates = {
  //   equal: () => () => true, // always true
  //   gender:
  //     () =>
  //     ({ isMale }) =>
  //       isMale === gender,
  //   development:
  //     () =>
  //     ({ development }) =>
  //       development ===
  //       References.preferences.development.indexOf(getDevelopment(dob)),
  // };

  // const getPredicate = predicates[preference] || predicates.equal;
  // const reference = preferences.find(getPredicate());

  // return reference || DEFAULT_REFERENCE;
};

export default findReference;
