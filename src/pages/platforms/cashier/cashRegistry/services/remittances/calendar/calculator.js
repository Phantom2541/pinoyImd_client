const computeRemittance = (remittance) => {
  const {
    gross: sales,
    opening = { sum: 0 },
    expenses = 0,
    breakdown = {},
  } = remittance;

  const fc = opening.sum;
  const { cheque = 0, voucher = 0, credit = 0, gcash = 0 } = breakdown; // fallback each field individually

  const nonCash = gcash + voucher + cheque;
  const cashSales = sales - nonCash;
  const cashOnHand = cashSales + fc - expenses;

  return {
    sales,
    gcash,
    voucher,
    cheque,
    credit,
    cashSales,
    fc,
    expenses,
    breakdown,
    cashOnHand,
  };
};

export default computeRemittance;
