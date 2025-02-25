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
  // getDepartment: pk => {
  //   const { code = "", positions = [] } =
  //     collections.find(({ positions = [] }) =>
  //       positions.some(({ id }) => id === Number(pk))
  //     ) || {};

  //   if (!code) return { department: "", role: "" };
  //   const role = [...positions].find(({ id }) => id === Number(pk)).name;
  //   return { department: code, role };
  // },
  getPositions: (code) => {
    const { positions = [] } = collections.find(
      ({ code: department }) => department === code
    );
    return positions;
  },
};
export default Policy;
