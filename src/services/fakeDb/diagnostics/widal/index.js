import collections from "./collections.json";
const titers = ["<1:40", "1:40", "1:80", "1:160", "1:320"];
const interpretation = {
  "<1:40": "Normal",
  "1:40": "High",
  "1:80": "Warning",
  "1:160": "Positive",
  "1:320": "Maximum",
};
const colorCoding = {
  "<1:40": "black", // Normal
  "1:40": "#006400", // Dark Green
  "1:80": "#FFA500", // Dark Orange
  "1:160": "#8B0000", // Dark Red
  "1:320": "#4B0082", // Indigo / very dark purple
};
const Widal = {
  collections,
  titers,
  get: {
    name: (abbr) => collections.find((c) => c.abbr === abbr)?.name,
    interpretation: (titer) => {
      if (!titer) return "";
      return interpretation[titer];
    },
    color: (titer) => {
      if (!titer) return "black";
      return colorCoding[titer];
    },
  },
};

export default Widal;
