const fullName = (fullname, isComplete = false) => {
  if (typeof fullname !== "object" || !fullname.fname || !fullname.lname)
    return "-";

  const { fname, mname = "", lname, suffix = "" } = fullname;

  let middleName = mname || "";

  if (mname && !isComplete) {
    middleName = `${mname
      .split(" ")
      .map((middle) => middle.charAt(0).toUpperCase())
      .join("")}.`;
  }

  const suffixPart = suffix && suffix !== "NONE" ? ` ${suffix}` : "";
  const middlePart = mname ? ` y ${middleName}` : "";

  return `${lname.toUpperCase()}, ${fname.toUpperCase()}${suffixPart?.toUpperCase()}${middlePart}`;
};

export default fullName;
