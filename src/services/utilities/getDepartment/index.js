const departmentMap = {
  laboratory: "LAB",
  lab: "LAB",
  radiology: "RAD",
  rad: "RAD",
};
const getDepartment = (department = "") => {
  const _department = department?.toLowerCase();
  return departmentMap[_department];
};

export default getDepartment;
