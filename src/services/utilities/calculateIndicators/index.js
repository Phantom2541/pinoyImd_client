const calculateIndicators = (reference, value) => {
  const { crical, alert, warn } = reference;

  if (!crical) return null;

  if (value >= crical) return "***";
  if (value >= alert) return "**";
  if (value >= warn) return "*";

  return null;
};

export default calculateIndicators;
