const contacts = (contact) => {
  if (!contact) return "-";

  // Remove all non-digit characters
  const digits = contact.replace(/\D/g, "");

  // If starts with 0 and has enough length, convert to +63 and slice accordingly
  if (digits.startsWith("0") && digits.length >= 11) {
    const number = digits.slice(1); // remove leading 0
    return `+63 ${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(
      6,
      10
    )}`;
  }

  // Else return as is with basic formatting (for numbers not starting with 0)
  return `+${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(
    5,
    8
  )}-${digits.slice(8, 12)}`;
};

export default contacts;
