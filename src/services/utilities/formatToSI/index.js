// Mapping of tests with their units and conversion factors
const tests = {
  "FASTING BLOOD SUGAR": { unit: "mmol/L", factor: 0.055 },
  "TOTAL CHOLESTEROL": { unit: "mmol/L", factor: 0.02586 },
  "HIGH DENSITY LIPOPROTEIN-CHOLESTEROL": { unit: "mmol/L", factor: 0.02586 },
  "LOW DENSITY LIPOPROTEIN-CHOLESTEROL": { unit: "mmol/L", factor: 0.02586 },
  "VERY LOW DENSITY LIPOPROTEIN": { unit: "mmol/L", factor: 0.02586 },
  TRIGLYCERIDES: { unit: "mmol/L", factor: 0.011 },
  "BLOOD URIC ACID": { unit: "mmol/L", factor: 0.059 },
  "BLOOD UREA NITROGEN": { unit: "mmol/L", factor: 0.357 },
  CREATININE: { unit: "µmol/L", factor: 88.4 },
  // "ALANINE AMINOTRANSFERASE": { unit: "U/L", factor: 1 },
  // "ASPARTATE AMINOTRANSFERASE": { unit: "U/L", factor: 1 },
  // "LDL/HDL RATIO": { unit: "Ratio", factor: 1 },
  // "CHOLESTEROL/HDL RATIO": { unit: "Ratio", factor: 1 },
  // SODIUM: { unit: "mmol/L", factor: 0.4114 },
  // POTASSIUM: { unit: "mmol/L", factor: 1 },
  // CHLORIDE: { unit: "mmol/L", factor: 0.4114 },
  // CALCIUM: { unit: "mmol/L", factor: 0.4114 },
  // MAGNESIUM: { unit: "mmol/L", factor: 0.4114 },
  // "CALCIUM, IONIZED": { unit: "mmol/L", factor: 0.4114 },
  // "CALCIUM, TOTAL": { unit: "mmol/L", factor: 0.4114 },
  // PHOSPHATE: { unit: "mmol/L", factor: 0.4114 },
  // "PHOSPHATE, IONIZED": { unit: "mmol/L", factor: 0.4114 },
  // "PHOSPHATE, TOTAL": { unit: "mmol/L", factor: 0.4114 },
  "TOTAL PROTEIN": { unit: "g/L", factor: 0.4114 },
  "TOTAL BILIRUBIN": { unit: "mg/dL", factor: 0.4114 },
  "DIRECT BILIRUBIN": { unit: "mg/dL", factor: 0.4114 },
  "INDIRECT BILIRUBIN": { unit: "mg/dL", factor: 0.4114 },
  // "ALKALINE PHOSPHATASE": { unit: "U/L", factor: 1 },
  // GGT: { unit: "U/L", factor: 1 },
  ALBUMIN: { unit: "g/L", factor: 0.4114 },
  // CK: { unit: "U/L", factor: 1 },
  // LDH: { unit: "U/L", factor: 1 },
  // AMYLASE: { unit: "U/L", factor: 1 },
  // LIPASE: { unit: "U/L", factor: 1 },
  HBA1C: { unit: "mmol/L", factor: 0.055 },
};
const formatToSI = (service, value) => {
  // Default values if not found
  const { unit = null, factor = 1 } = tests[service] || {};

  // If walang value → return unit lang
  if (value === undefined) return unit;

  // Apply conversion
  const converted = value * factor;

  let formattedValue =
    parseFloat(converted) < 5
      ? parseFloat(converted).toFixed(2) // always 2 decimals if < 5
      : Number.isInteger(converted)
      ? converted // whole number
      : parseFloat(converted).toFixed(1); // 1 decimal if not whole

  return formattedValue;
};

export default formatToSI;
