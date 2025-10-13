const utils = {
  build: (refNo, paymentMethod, chargeAmount, cardHolder) => {
    if (!["mixed", "voucher"].includes(paymentMethod)) return null;
    if (paymentMethod === "mixed") return utils.splitBill(refNo, chargeAmount);
    return utils.voucher(refNo, paymentMethod, chargeAmount, cardHolder);
  },
  voucher: (refNo, paymentMethod, chargeAmount, cardHolder) => {
    if (paymentMethod !== "voucher") return null;
    // if (paymentMethod === "voucher")
    //   return { amount: chargeAmount, pp: "cash" };

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
  splitBill: (refNo, chargeAmount) => {
    const { pp = "", careOf = {} } = refNo;
    var _refNo = { ...refNo };
    if (pp === "gcash") {
      const { amount = 0 } = careOf;
      _refNo = { ...refNo, amount: chargeAmount - amount };
    } else {
      _refNo = {
        ...refNo,
        amount:
          refNo.amount > chargeAmount
            ? chargeAmount
            : chargeAmount - refNo.amount,
      };
    }

    const { amount } = refNo;

    _refNo = {
      ...refNo,
      careOf: { ...careOf, amount: chargeAmount - amount },
    };

    if (careOf.pp !== "co") {
      const { user, ...rest } = careOf;
      _refNo = {
        ...refNo,
        careOf: { ...rest },
      };
    }

    return _refNo;
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
