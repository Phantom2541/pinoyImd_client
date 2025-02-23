import collections from "./collections.json";

const Policy = {
  collections,
  getDepartment: (pk) => {
    if (pk < 0) return "unknown department";
    console.log(pk);
    const { code = 0, positions = [] } =
      collections.find(({ positions = [] }) =>
        positions.some(({ id }) => id === pk)
      ) || {};
    if (positions.length === 0) return "unknown designation";
    const role = [...positions].find(({ id }) => id === pk).display_name;
    return { department: code, role };
  },
};
export default Policy;
