const currency = (num = 0) => {
  if (!num) return "₱ 0";

  const options = {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  return num.toLocaleString("en-US", options);
};

export default currency;
