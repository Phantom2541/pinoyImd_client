const fullNameSearch = (searchKey, array, custom = "") => {
  const [_lname, rest = ""] = searchKey.toUpperCase()?.split(", "),
    [_fname, _mname] = rest.split(" Y ");

  if (!_lname) return [];

  return array.filter((data) => {
    // if full name is not directly accessible, pass a custom key name
    const fullName = custom ? data[custom]?.fullName : data?.fullName;

    const { fname, lname, mname = "" } = fullName;

    if (!rest && lname.includes(_lname?.trim())) return true;

    if (
      !_mname &&
      lname.includes(_lname?.trim()) &&
      fname.includes(_fname?.trim())
    )
      return true;

    if (
      mname.includes(_mname?.trim()) &&
      lname.includes(_lname?.trim()) &&
      fname.includes(_fname?.trim())
    )
      return true;

    return false;
  });
};

export default fullNameSearch;
