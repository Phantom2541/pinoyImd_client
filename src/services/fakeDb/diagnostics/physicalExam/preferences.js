const Preferences = {
  physical: {
    "Time of Specimen": { lo: "", hi: "", unit: "" },
    "Time of Examination": { lo: "", hi: "", unit: "" },
    "Duration of abstinence": { lo: 2, hi: 7, unit: "days" },
    "Liquefaction at 37 °C": { lo: 20, hi: 60, unit: "minutes" },
    Volume: { lo: 1.5, hi: "", unit: "mL" },
    Appearance: { lo: "Grayish White", hi: "", unit: "" },
    Colour: { lo: "Grey", hi: "", unit: "" },
    Viscosity: { lo: "Thick", hi: "", unit: "" },
    pH: { lo: 7.2, hi: 8.0, unit: "" },
  },

  semen: {
    "Total sperm concentration": { lo: 15, hi: "", unit: "Million/mL" },
    "Percentage motility": { lo: 40, hi: "", unit: "%" },
    "Grade A (Fast progressive)": { lo: 25, hi: "", unit: "%" },
    "Grade B (Slow progressive)": { lo: 25, hi: "", unit: "%" },
    "Grade C (Immotile)": { lo: 20, hi: "", unit: "%" },
    Vitality: { lo: 58, hi: "", unit: "%" },
    Agglutination: { lo: "None", hi: "", unit: "" },
    "Pus cells": { lo: 0, hi: 5, unit: "/hpf" },
    "Red Blood cells": { lo: "Nil", hi: "", unit: "/hpf" },
    "Epithelial cells": { lo: "Nil", hi: "", unit: "/hpf" },

    // Morphology
    "Normal morphology": { lo: 70, hi: 75, unit: "%" },
    "Abnormal morphology": { lo: 25, hi: 30, unit: "%" },
    "a. Head defects": { lo: 10, hi: 15, unit: "%" },
    "b. Neck & mid piece": { lo: 5, hi: 10, unit: "%" },
    "c. Tail defects": { lo: 10, hi: 15, unit: "%" },
  },

  chemical: {
    "Semen Fructose, Qualitative": { lo: "Positive", hi: "Positive", unit: "" },
  },
};

export default Preferences;
