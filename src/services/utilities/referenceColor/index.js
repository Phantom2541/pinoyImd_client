const referenceColor = (value, critical, alert, warn) => {
  if (critical && value >= critical) return "red";

  if (alert && value >= alert) return "orange";

  if (warn && value >= warn) return "blue";

  return "";
};

export default referenceColor;
