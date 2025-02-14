const mobile = mobile => {
  if (!mobile) return "-";

  return `+63 ${mobile.slice(0, 3)}-${mobile.slice(3, 6)}-${mobile.slice(
    6,
    10
  )}`;
};

export default mobile;
