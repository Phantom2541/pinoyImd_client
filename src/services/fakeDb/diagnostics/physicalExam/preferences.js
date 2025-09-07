const Preferences = {
  physical: {
    da: {
      snug: 1,
      lo: 2,
      hi: 7,
      warn: 8,
      alert: 0,
      crical: 0,
      unit: "days",
    },
    lf: {
      snug: 29,
      lo: 30,
      hi: 10,
      warn: 16,
      alert: 0,
      crical: 18,
      unit: "minutes",
    },
    vol: {
      snug: 0,
      lo: ">",
      hi: 1.5,
      warn: 0,
      alert: 0,
      crical: 0,
      unit: "mL",
    },
  },

  plt: { snug: 100, lo: 150, hi: 450, warn: 600, alert: 800, crical: 1000 },
  semen: {
    "Total sperm concentration": {
      lo: 15,
      hi: "", // no upper bound
      unit: "Million/mL",
    },
    "Percentage motility": {
      lo: 50,
      hi: "",
      unit: "%",
    },
    "Grade A": {
      lo: "", // no reference given
      hi: "",
      unit: "%",
    },
    "Grade B": {
      lo: "",
      hi: "",
      unit: "%",
    },
    "Grade C": {
      lo: "",
      hi: "",
      unit: "%",
    },
    "Vitality ": {
      lo: 58,
      hi: "",
      unit: "%",
    },
    "Agglutination ": {
      lo: 0,
      hi: 0,
      unit: "Negative",
    },
    "Pus cells": {
      lo: 0,
      hi: 0,
      unit: "/hpf",
    },
    "Red Blood cells": {
      lo: 0,
      hi: 0,
      unit: "/hpf",
    },
    "Epithelial cells": {
      lo: 0,
      hi: 0,
      unit: "/hpf",
    },
  },

  rci: {
    MCV: {
      snug: 0,
      lo: 76,
      hi: 96,
      warn: 5,
      alert: 15,
      crical: 20,
      unit: "fl",
    },
    MCH: {
      snug: 0,
      lo: 27,
      hi: 32,
      warn: 5,
      alert: 15,
      crical: 20,
      unit: "pg",
    },
    MCHC: {
      snug: 0,
      lo: 300,
      hi: 350,
      warn: 5,
      alert: 15,
      crical: 20,
      unit: "g/l",
    },
    RDWc: {
      snug: 0,
      lo: 11.0,
      hi: 15.0,
      warn: 5,
      alert: 15,
      crical: 20,
      unit: "%",
    },
  },
};

export default Preferences;
