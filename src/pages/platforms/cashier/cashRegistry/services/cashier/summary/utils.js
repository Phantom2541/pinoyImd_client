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
    if (pp === "co") {
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
      const amt = chargeAmount - amount;
      const total = amt > -1 ? amt : 0;
      _refNo = { ...refNo, amount: total };
    } else {
      const { number, ...rest } = refNo;
      const amt = refNo.amount > chargeAmount ? chargeAmount : refNo.amount;
      _refNo = {
        ...rest,
        amount: amt,
      };
    }

    if (careOf.pp === "gcash") {
      const { user, category, ...rest } = careOf;
      const amt = chargeAmount - refNo.amount || 0;
      const total = amt > -1 ? amt : 0;
      _refNo = {
        ..._refNo,
        careOf: { ...rest, amount: total },
      };
    } else {
      const { number, ...rest } = careOf;
      const otherAmt = _refNo.pp === "cash" ? _refNo.amount : 0;
      const remaining = chargeAmount - otherAmt;
      const amt = careOf.amount > remaining ? remaining : careOf.amount;
      _refNo = {
        ..._refNo,
        careOf: { ...rest, amount: amt },
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
    if (creditCoveredEnough) return false;

    if (pp === "cash") return true;

    return false;
  },
};

export default utils;
