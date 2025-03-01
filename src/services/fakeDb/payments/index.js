const Payments = {
  opd: ["cash", "gcash", "cheque", "downpayment"],
  er: ["cash", "gcash", "cheque", "voucher"], // Credit: Note Receivable
  cw: ["cash", "gcash", "cheque", "voucher"], // credit: [patient, company]
  pw: ["cash", "gcash", "cheque", "voucher"],
  hmo: ["voucher"], // need SOA
  sc: ["cash", "gcash", "voucher"],
  ssc: ["cash", "gcash", "voucher"],
  // opd: ["cash", "gcash", "cheque"],
  // er: ["cash", "gcash", "cheque", "voucher"], // Credit: Note Receivable
  // cw: ["cash", "gcash", "cheque", "voucher"], // voucher: [patient, company]
  // pw: ["cash", "gcash", "cheque", "voucher"],
  // hmo: ["voucher"], // need SOA
  // sc: ["cash", "gcash", "cheque", "voucher"], // subcontract | 10% discount from srp
  // ssc: ["cash", "gcash", "cheque", "voucher"], // special subcontract | 20% discount from srp
  promo: ["cash", "gcash", "cheque"],
  vp: ["cash", "gcash", "cheque"], // vendor price | 5% discount from srp
};

export default Payments;
