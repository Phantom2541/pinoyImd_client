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

  getDevelopmentByBirthDate(dob) {
    if (!dob) return null;

    const bd = new Date(dob);
    if (isNaN(bd)) return null;

    const now = new Date();
    const ageInDays = Math.floor((now - bd) / (1000 * 60 * 60 * 24));

    return preferences.development.find(
      (d) => ageInDays >= d.minDay && ageInDays <= d.maxDay
    );
  },
};

export default References;
