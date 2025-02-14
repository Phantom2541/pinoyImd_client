const sourceColor = source => {
  if (source === "hmo") return "info";
  if (source === "cw") return "warning";
  if (source === "pw") return "success";
  if (source === "er") return "danger";

  return "primary";
};

export default sourceColor;
