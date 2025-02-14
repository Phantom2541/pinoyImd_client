const capitalize = string => {
  if (!string) return "-";

  const words = string.split(" ");

  return words
    .map(word => {
      if (word.length === 0) return "";

      return `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`;
    })
    .join(" ");
};

export default capitalize;
