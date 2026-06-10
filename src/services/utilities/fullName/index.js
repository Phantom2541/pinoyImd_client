const fullName = (fullname, isComplete = false, isProper = false) => {
  const normalizedName = fullname?.fullName || fullname;

  if (
    typeof normalizedName !== "object" ||
    !normalizedName.fname ||
    !normalizedName.lname
  )
    return "-";

  const { fname, mname = "", lname, suffix = "", title = "" } = normalizedName;

  let middleName = mname || "";

  if (mname && !isComplete) {
    middleName = `${mname
      .split(" ")
      .map((middle) => middle.charAt(0).toUpperCase())
      .join("")}.`;
  }

  const suffixPart = suffix && suffix !== "NONE" ? ` ${suffix}` : "";
  const middlePart = mname ? ` y ${middleName?.toUpperCase()}` : "";

  if (isProper)
    return `${title} ${fname.toUpperCase()} ${middleName} ${lname.toUpperCase()}${suffixPart?.toUpperCase()}`;

  return `${lname.toUpperCase()}, ${fname.toUpperCase()}${suffixPart?.toUpperCase()}${middlePart}`;
};

export default fullName;
