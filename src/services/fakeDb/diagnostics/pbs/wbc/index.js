import { getAge } from "../../../../utilities";
import reference from "./references";

const titles = [
  "Total WBC Count",
  "Neutrophils",
  "Lymphocytes",
  "Eosinophils",
  "Basophils",
];
const wbc = {
  titles,
  getReference: (index, dob) => {
    const age = getAge(dob, true);
    const baseKey = index === 0 ? "total" : titles[index].toLowerCase();
    if (age < 18) {
      return reference.Pediatric[baseKey];
    } else if (age >= 18 && age < 60) {
      return reference.Adult[baseKey];
    } else {
      return reference.Elderly[baseKey];
    }
  },
  computeCount: (results, index) => {
    const total = results[0];
    if (!total) return 0;
    if (!results[index]) return 0;
    return Number((results[index] / 100) * total).toFixed(2);
  },
};

export default wbc;
