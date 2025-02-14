const getDevelopment = (dob) => {
  if (!dob) return "-";

  const days = Math.floor((new Date() - new Date(dob)) / 1000 / 60 / 60 / 24);

  if (days < 30) return "Newborn"; //
  else if (days < 365) return "Infant";
  else if (days < 1095) return "Toddler";
  else if (days < 2190) return "Child";
  else if (days < 4380) return "Teenager";
  else if (days < 6570) return "Adolescent";
  else if (days < 14600) return "Young Adult";
  else if (days < 23725) return "Adult";

  return "Geriatric";
};

export default getDevelopment;
