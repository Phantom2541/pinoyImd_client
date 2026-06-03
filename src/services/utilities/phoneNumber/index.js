const splitPhoneNumbers = (value = "") =>
  String(value)
    .split(/\s*(?:\/|,|;|\n|&)\s*/g)
    .map((part) => part.trim())
    .filter(Boolean);

const groupFallback = (digits = "") =>
  digits.replace(/(\d{3,4})(?=\d)/g, "$1 ").trim();

const formatSinglePhoneNumber = (value = "") => {
  const raw = String(value).trim();
  const digits = raw.replace(/\D/g, "");

  if (!digits) return raw;

  if (digits.startsWith("63") && digits.length === 12) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
      5,
      8
    )} ${digits.slice(8, 12)}`;
  }

  if (digits.startsWith("09") && digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(
      7,
      11
    )}`;
  }

  if (digits.startsWith("9") && digits.length === 10) {
    return `0${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(
      6,
      10
    )}`;
  }

  if (digits.startsWith("02") && digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)} ${digits.slice(
      6,
      10
    )}`;
  }

  if (digits.startsWith("0") && digits.length === 11) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(
      6,
      11
    )}`;
  }

  if (digits.length === 8) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)}`;
  }

  if (digits.length === 7) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)}`;
  }

  return groupFallback(digits);
};

export const formatPhoneNumber = (value = "") => {
  const parts = splitPhoneNumbers(value);
  if (!parts.length) return "";

  return parts.map(formatSinglePhoneNumber).join(" / ");
};

export const getPrimaryDialNumber = (value = "") => {
  const [first = ""] = splitPhoneNumbers(value);
  return first.replace(/[^\d+]/g, "");
};

export default formatPhoneNumber;
