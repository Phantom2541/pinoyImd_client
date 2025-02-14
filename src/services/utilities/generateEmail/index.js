const removeSpace = string => string.split(" ").join("_");

const generateEmail = user => {
  if (typeof user !== "object") return "-";

  const { fullName, dob } = user,
    { lname, fname } = fullName;

  return `${removeSpace(lname)}.${removeSpace(fname)}.${dob}@smartcare.com.ph`;
};

export default generateEmail;
