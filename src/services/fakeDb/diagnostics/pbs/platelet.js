import { getAge } from "../../../utilities";

const reference = {
  Adult: { lo: 150000, hi: 450000 },
  Elderly: { lo: 140000, hi: 450000 },
  Pediatric: { lo: 150000, hi: 450000 },
};

const platelet = {
  getReference: (dob) => {
    const age = getAge(dob, true);
    if (age < 18) {
      return reference.Pediatric;
    } else if (age >= 18 && age < 60) {
      return reference.Adult;
    } else {
      return reference.Elderly;
    }
  },
};

export default platelet;
