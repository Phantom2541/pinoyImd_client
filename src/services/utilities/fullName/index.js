const fullName = (fullname, isComplete = false, isProper = false) => {
  if (typeof fullname !== "object" || !fullname.fname || !fullname.lname)
    return "-";

  const { fname, mname = "", lname, suffix = "", title = "" } = fullname;

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
