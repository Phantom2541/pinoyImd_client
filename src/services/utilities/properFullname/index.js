const properFullname = (fullname) => {
  if (typeof fullname !== "object" || !fullname.fname || !fullname.lname)
    return "-";

  const { postnominal, fname, mname = "", lname, suffix = "" } = fullname;

  let middleName = mname;

  if (mname) {
    middleName = `${mname
      .split(" ")
      .map((middle) => middle.charAt(0).toUpperCase())
      .join("")}.`;
  }

  return `${fname} ${mname && middleName} ${lname}${suffix && ` ${suffix}`}${
    postnominal && `, ${postnominal}`
  }`.replace(/^\s+|\s+$/gm, "");
};

export default properFullname;
