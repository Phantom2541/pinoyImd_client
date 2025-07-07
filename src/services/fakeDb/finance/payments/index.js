const Payments = {
  wi: ["cash", "gcash", "cheque", "voucher", "downpayment", "Split Bill"],
  opd: ["cash", "gcash", "cheque", "voucher", "Split Bill"],
  er: ["cash", "gcash", "cheque", "voucher", "downpayment"], // Credit: Note Receivable
  cw: ["cash", "gcash", "cheque", "voucher"], // credit: Note Receivable
  pw: ["cash", "gcash", "cheque", "voucher"],
  sw: ["cash", "gcash", "cheque", "voucher"],
  bp: ["cash", "gcash", "Split Bill"], // cash & Gcash
  mc: ["cash", "gcash", "Split Bill"],
  sc: ["cash", "gcash", "Split Bill"],
  mbs: ["cash", "gcash", "voucher", "Split Bill"], // v 5% and up discount from srp
  ctr: ["voucher"],
  wls: ["voucher", "Split Bill"],
  promo: ["cash", "gcash", "cheque"],
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
// st: suite
// bp: business permit
// mc: medical clearance
// sc: surgical clearance
// mbs: membership
// ctr: contract
// wls: wellness (health maintenance organization and Philhealth)
// promo: promotion
