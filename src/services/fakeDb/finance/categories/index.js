const Categories = [
  { abbr: "wi", name: "Walkin", color: "green", type: "walkin" },
  // in patient
  { abbr: "er", name: "Emergency Room", color: "blue", type: "inpatient" },
  { abbr: "cw", name: "Charity Ward", color: "blue", type: "inpatient" },
  { abbr: "pw", name: "Private Ward", color: "blue", type: "inpatient" },
  { abbr: "sr", name: "Suite Room", color: "blue", type: "inpatient" },
  // out patient
  {
    abbr: "opd",
    name: "Out Patient Department",
    color: "black",
    type: "outpatient",
  },
  // Corporate/Wellness
  { abbr: "wls", name: "Wellness", color: "orange", type: "corporate" },
  { abbr: "mbs", name: "Membership", color: "orange", type: "corporate" },
  { abbr: "ctr", name: "Contract", color: "orange", type: "corporate" },
  // Permits/Clearance
  { abbr: "bp", name: "Business Permit", color: "red", type: "clearance" },
  { abbr: "mc", name: "Medical Clearance", color: "red", type: "clearance" },
  { abbr: "sc", name: "Surgical Clearance", color: "red", type: "clearance" },
  { abbr: "rfr", name: "Referrals", color: "red", type: "clearance" },
  // Promo
  { abbr: "prm", name: "Promotion", color: "purple", type: "promo" },
];

export default Categories;

// Discount Policy Explanation:
//
// 1. Insourcing ("mbs"):
//    - Pricing is based on the **standard retail price (SRP)**.
//    - A discount is applied based on the **membership level** of the vendors.
//    - Example: If SRP is ₱1000 and membership discount is 10%, the final price is ₱900.
//    - This ensures dynamic pricing tied to membership privileges.
//
// 2. Other Categories (e.g., "wi", "opd", "er", "promo", etc.):
//    - These have **fixed prices** or **package-specific rates**.
//    - Discounts, if any, are already embedded in their pricing or handled manually.
//    - Pricing does not rely on SRP or membership-based discounts.
//
// Summary:
// - "mbs" → dynamic discount from SRP based on membership.
// - others → fixed or predefined pricing, not tied to SRP.
