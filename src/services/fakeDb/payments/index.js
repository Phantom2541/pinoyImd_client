const Payments = {
  opd: ["cash", "gcash", "cheque", "downpayment"],
  er: ["cash", "gcash", "cheque", "voucher"], // Credit: Note Receivable
  cw: ["cash", "gcash", "cheque", "voucher"], // credit: [patient, company]
  pw: ["cash", "gcash", "cheque", "voucher"],
  hmo: ["voucher"], // need SOA
  sc: ["cash", "gcash", "voucher"],
  ssc: ["cash", "gcash", "voucher"],
  promo: ["cash", "gcash", "cheque"],
};

export default Payments;
