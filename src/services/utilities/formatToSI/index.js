const formatToSI = (service, value = undefined) => {
  const unitMappings = {
    "FASTING BLOOD SUGAR": "mmol/L",
    "TOTAL CHOLESTEROL": "mmol/L",
    "HIGH DENSITY LIPOPROTEIN-CHOLESTEROL": "mmol/L",
    "LOW DENSITY LIPOPROTEIN-CHOLESTEROL": "mmol/L",
    TRIGLYCERIDES: "mmol/L",
    "VERY LOW DENSITY LIPOPROTEIN": "mmol/L",
    "BLOOD URIC ACID": "mmol/L",
    "BLOOD UREA NITROGEN": "mmol/L",
    POTASSIUM: "mmol/L",
    CREATININE: "umol/l",
    "ALANINE AMINOTRANSFERASE": "U/L",
    "ASPARTATE AMINOTRANSFERASE": "U/L",
    "GLYCOSYLATED HEMOGLOBIN": "%",
  };

  const conversionFactors = {
    "FASTING BLOOD SUGAR": 0.055,
    "TOTAL CHOLESTEROL": 0.02586,
    "HIGH DENSITY LIPOPROTEIN-CHOLESTEROL": 0.02586,
    "LOW DENSITY LIPOPROTEIN-CHOLESTEROL": 0.02586,
    "VERY LOW DENSITY LIPOPROTEIN": 0.02586,
    TRIGLYCERIDES: 0.011,
    CREATININE: 88.4,
    "BLOOD URIC ACID": 0.059,
    "BLOOD UREA NITROGEN": 0.357,
  };

  if (value === undefined) {
    return unitMappings[service] || null;
  }

  const conversionFactor = conversionFactors[service] || 1; // Default to 1 if service not found

  const converted = value * conversionFactor;

  return converted > 15
    ? parseInt(converted)
    : converted > 10
    ? converted.toFixed(1)
    : converted.toFixed(2);
};

export default formatToSI;
