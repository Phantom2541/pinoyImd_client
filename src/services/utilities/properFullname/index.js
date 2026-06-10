import capitalize from "../capitalize";

const properFullname = (fullname) => {
  const normalizedName = fullname?.fullName || fullname;

  if (
    typeof normalizedName !== "object" ||
    !normalizedName.fname ||
    !normalizedName.lname
  )
    return "-";

  const {
    postnominal = "",
    fname = "",
    mname = "",
    lname = "",
    suffix = "",
  } = normalizedName;

  let middleName = mname;

  if (mname) {
    middleName = `${mname
      .split(" ")
      .map((middle) => middle.charAt(0).toUpperCase())
      .join("")}.`;
  }

  return `${capitalize(fname)} ${mname && capitalize(middleName)} ${capitalize(
    lname
  )}${suffix && ` ${capitalize(suffix)}`}${
    postnominal && `, ${postnominal.toUpperCase()}`
  }`.replace(/^\s+|\s+$/gm, "");
};

export default properFullname;
