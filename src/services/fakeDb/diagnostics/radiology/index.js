import collections from "./collections.json";
const modalityMap = {
  ultrasound: "utz",
  ecg: "ecg",
  xray: "x-ray",
};
const RadHC = {
  collections: [...collections],
  find: (pk) => collections.find(({ id }) => id === Number(pk)),
  getByModality: (form) =>
    collections.filter(
      ({ modality }) =>
        modality.toLowerCase() === modalityMap[form?.toLowerCase()]
    ),

  getName: function (pk) {
    return this.find(pk)?.name || `No name found for: ${pk}`;
  },
  whereIn: (cluster) => collections?.filter(({ id }) => cluster?.includes(id)),
  whereNotIn: (cluster) =>
    collections.filter(({ id }) => !cluster.includes(id)),
};

export default RadHC;
