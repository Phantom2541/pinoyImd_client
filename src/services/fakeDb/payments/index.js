const Payments = {
  opd: ["cash", "gcash", "cheque"],
  er: ["cash", "gcash", "cheque", "credit"], // Credit: Note Receivable
  cw: ["cash", "gcash", "cheque", "credit"], // credit: [patient, company]
  pw: ["cash", "gcash", "cheque", "credit"],
  hmo: ["credit"], // need SOA
  sc: ["credit"],
  ssc: ["credit"],
  promo: ["cash", "gcash", "cheque"],
};

export default Payments;
