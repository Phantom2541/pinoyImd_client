const getBday = (dob = new Date()) => {
  const date = new Date(dob);
  const month = date.toLocaleString("en-US", { month: "short" }); // "Sep"
  const day = date.getDate(); // 8
  return `${month},${day}`;
};

export default getBday;
