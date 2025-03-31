const Payments = {
  wi: ["cash", "gcash", "cheque", "voucher", "downpayment"], // walkin
  opd: ["cash", "gcash", "cheque", "voucher", "downpayment"],
  er: ["cash", "gcash", "cheque", "voucher"], // Credit: Note Receivable
  cw: ["cash", "gcash", "cheque", "voucher"], // credit: [patient, company]
  pw: ["cash", "gcash", "cheque", "voucher"], // private ward
  promo: ["cash", "gcash", "cheque"],
  hmo: ["voucher"], // need SOA
  is: ["cash", "gcash", "voucher"], // vendor price | 5% and up discount from srp
  bp: ["cash", "gcash", "voucher"], // business permit
  mc: ["cash", "gcash"], // medical clearance
  sc: ["cash", "gcash"], // surgical clearance
};

export default Payments;
