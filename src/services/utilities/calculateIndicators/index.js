const calculateIndicators = (reference, value) => {
  const { critical, alert, warn } = reference;

  if (!critical) return null;

  if (value >= critical) return "***";
  if (value >= alert) return "**";
  if (value >= warn) return "*";

  return null;
};

export default calculateIndicators;
