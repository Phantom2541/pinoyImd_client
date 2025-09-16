const utils = {
  buildRefNo: (refNo, paymentMethod, chargeAmount, cardHolder) => {
    if (paymentMethod !== "mixed" && paymentMethod !== "voucher") return null;
    if (paymentMethod === "voucher")
      return { amount: chargeAmount, pp: "cash" };

    const { company = {} } = cardHolder || {};
    const isCardHolder = Boolean(company?.name || company?.ref);
    const { careOf, pp = "cash", amount: creditCovered, ...rest } = refNo;
    const creditCoveredEnough = creditCovered >= chargeAmount;

    var finalAmount = 0;
    if (pp === "co" || paymentMethod === "voucher") {
      finalAmount = chargeAmount;
    } else if (creditCoveredEnough) {
      finalAmount = chargeAmount;
    } else {
      finalAmount = creditCovered;
    }
    const careOfAmount =
      pp === "co" && !creditCoveredEnough
        ? isCardHolder
          ? chargeAmount - creditCovered
          : chargeAmount
        : 0;

    return {
      ...rest,
      pp: creditCoveredEnough && pp === "co" ? "cash" : pp,
      amount: isCardHolder ? finalAmount - careOfAmount : 0,
      ...(pp === "co" &&
        careOfAmount > 0 && { careOf: { ...careOf, amount: careOfAmount } }),
    };
  },
  hasCash: (refNo = {}, paymentMethod, chargeAmount = 0) => {
    const { pp = "cash", amount } = refNo || {};
    const creditCoveredEnough = amount >= chargeAmount;

    if (["downpayment", "cash"].includes(paymentMethod)) {
      return true;
    }
    if (paymentMethod === "voucher") return false;
    if (creditCoveredEnough) return false;

    if (pp === "cash") return true;

    return false;
  },
};

export default utils;
