// import { References } from "../../fakeDb";
// import { getDevelopment } from "../";

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
          preferences.find(({ serviceId }) => serviceId === Number(key)) ||
          null;

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

  // commented by thom thom

  // const preferencePredicates = {
  //   equal: () => true,
  //   gender: ({ isMale }) => isMale === gender,
  //   development: ({ development }) =>
  //     development ===
  //     References.preferences.development.indexOf(getDevelopment(dob)),
  // };

  // if (!preferencePredicates[preference]) {
  //   return {
  //     lo: 0,
  //     hi: 0,
  //     warn: 0,
  //     alert: 0,
  //     critical: 0,
  //     units: "",
  //     _id: "",
  //   };
  // }

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
};

export default findReference;
