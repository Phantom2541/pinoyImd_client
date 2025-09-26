import collections from "./collections.json";
const VisityType = {
  collections,
  getLabel: (value) => collections.find(({ value: v }) => v === value)?.label,
};

export default VisityType;
