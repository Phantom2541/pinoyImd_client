import forms from "./forms";
import preferences from "./preferences";
import units from "./units";

const References = {
  forms,
  preferences,
  units,
  // 🔍 Get development object by index
  getDevelopmentByIndex(index) {
    return preferences.development?.[index] ?? null;
  },

  // 🔍 Get development index by name
  getDevelopmentIndexByName(name) {
    return preferences.development.findIndex((d) => d.name === name);
  },

  // 🔍 Get development stage by age in days
  getDevelopmentByAgeInDays(days) {
    return preferences.development.find(
      (d) => days >= d.minDay && days <= d.maxDay
    );
  },
};

export default References;
