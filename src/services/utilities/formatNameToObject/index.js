const formatNameToObj = (searchKey) => {
  if (!searchKey) return {};

  // Convert to uppercase and trim spaces
  const cleaned = searchKey.toUpperCase().trim();

  // Check if name contains a comma
  if (cleaned.includes(",")) {
    const [lname, rest = ""] = cleaned.split(",").map((s) => s.trim());
    const [fname, mname] = rest.split(" Y ").map((s) => s.trim());

    if (!lname) return {};
    if (!mname) return { lname, fname };
    return { fname, lname, mname };
  } else {
    // No comma, split by space instead
    const parts = cleaned
      .split(" ")
      .map((s) => s.trim())
      .filter(Boolean);

    if (parts.length === 0) return {};

    const lname = parts[0];
    const fname = parts[1] || "";
    const mname = parts.slice(2).join(" ").replace("Y ", "") || "";

    const result = { lname };
    if (fname) result.fname = fname;
    if (mname) result.mname = mname;

    return result;
  }
};

export default formatNameToObj;
