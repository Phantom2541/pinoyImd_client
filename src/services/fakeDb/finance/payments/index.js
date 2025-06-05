const Payments = {
  wi: ["cash", "gcash", "cheque", "voucher", "downpayment"],
  opd: ["cash", "gcash", "cheque", "voucher", "downpayment"],
  er: ["cash", "gcash", "cheque", "voucher"], // Credit: Note Receivable
  cw: ["cash", "gcash", "cheque", "voucher"], // credit: Note Receivable
  pw: ["cash", "gcash", "cheque", "voucher"],
  promo: ["cash", "gcash", "cheque"],
  hmo: ["voucher"], // need SOA
  is: ["cash", "gcash", "voucher"], // v 5% and up discount from srp
  bp: ["cash", "gcash", "voucher"],
  mc: ["cash", "gcash"],
  sc: ["cash", "gcash"],
  sbc: ["voucher"], // sub contract
  ssc: ["voucher"], // special sub contract
};

export default Payments;
// This file defines the payment options available for different categories of services in a healthcare setting.
// Each category has specific payment methods that can be used, such as cash, gcash, cheque, voucher, and downpayment.
// Legend:
// wi: walk-in
// opd: out-patient department
// er: emergency room
// cw: crharity ward
// pw: private ward
// promo: promotion
// hmo: health maintenance organization
// is: insource
// bp: business permit
// mc: medical clearance
// sc: surgical clearance
// sbc : sub contract
// ssc: special sub contract
