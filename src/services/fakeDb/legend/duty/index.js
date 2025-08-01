import collections from "./collections.json";
const Duty = {
  collections,
  getWithoutOff: () =>
    Duty.collections.filter(({ code }) => !["RO", "O"].includes(code)),
};
export default Duty;
