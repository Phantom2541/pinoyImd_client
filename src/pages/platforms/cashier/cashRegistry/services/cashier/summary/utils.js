const utils = {
  buildRefNo: (refNo, paymentMethod, chargeAmount, cardHolder) => {
    if (paymentMethod !== "mixed") return null;
    const { type = "" } = cardHolder;
    const { careOf, pp, amount: creditCovered, ...rest } = refNo;
    var finalAmount = 0;
    if (pp === "co" || paymentMethod === "voucher") {
      finalAmount = chargeAmount;
    } else if (creditCovered > chargeAmount) {
      finalAmount = chargeAmount;
    } else {
      finalAmount = creditCovered;
    }

    const careOfAmount = type ? chargeAmount - creditCovered : chargeAmount;
    return {
      ...rest,
      amount: finalAmount,
      ...(pp === "co" && { careOf: { ...careOf, amount: careOfAmount } }),
    };
    // const baseRefNo = {
    //   ...rest,
    //   amount:
    //     pp === "co" || payment === "voucher"
    //       ? amount
    //       : rAmount > amount
    //       ? amount
    //       : rAmount,
    //   ...(pp === "co" && { careOf }),
    // };
  },
};

export default utils;
