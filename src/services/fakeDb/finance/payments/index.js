const Payments = {
  wi: [
    "cash",
    "gcash",
    "cheque",
    "voucher",
    "downpayment",
    "mixed", //Split Bill
  ],
  opd: ["cash", "gcash", "cheque", "voucher", "mixed"],
  er: ["cash", "gcash", "cheque", "voucher", "downpayment"], // Credit: Note Receivable
  cw: ["cash", "gcash", "cheque", "voucher"], // credit: Note Receivable
  pw: ["cash", "gcash", "cheque", "voucher"],
  sw: ["cash", "gcash", "cheque", "voucher"],
  bp: ["cash", "gcash", "mixed"], // cash & Gcash
  mc: ["cash", "gcash", "mixed"],
  sc: ["cash", "gcash", "mixed"],
  mbs: ["cash", "gcash", "voucher", "mixed"], // v 5% and up discount from srp
  ctr: ["voucher"],
  wls: ["voucher", "mixed"],
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
// mixed: split bill
