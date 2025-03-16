const Payments = {
  walkin: ["cash", "gcash", "cheque", "downpayment", "voucher"],
  opd: ["cash", "gcash", "cheque", "downpayment"],
  er: ["cash", "gcash", "cheque", "voucher"], // Credit: Note Receivable
  cw: ["cash", "gcash", "cheque", "voucher"], // credit: [patient, company]
  pw: ["cash", "gcash", "cheque", "voucher"], // private ward
  hmo: ["voucher"], // need SOA
  sc: ["cash", "gcash", "voucher"],
  ssc: ["cash", "gcash", "voucher"],
  promo: ["cash", "gcash", "cheque"],
  vp: ["cash", "gcash", "cheque"], // vendor price | 5% discount from srp
};

export default Payments;
