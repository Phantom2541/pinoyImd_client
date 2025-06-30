const Categories = [
  { abbr: "wi", name: "Walkin", color: "green" },
  { abbr: "opd", name: "Out Patient Department", color: "blue" },
  { abbr: "er", name: "Emergency Room", color: "blue" },
  { abbr: "cw", name: "Charity Ward", color: "blue" },
  { abbr: "pw", name: "Private Ward", color: "blue" },
  { abbr: "sr", name: "Suite Room", color: "blue" },
  { abbr: "wls", name: "Wellness", color: "orange" },
  { abbr: "mbs", name: "Membership", color: "orange" },
  { abbr: "ctr", name: "Contract", color: "orange" },
  { abbr: "bp", name: "Business Permit", color: "red" },
  { abbr: "mc", name: "Medical Clearance", color: "red" },
  { abbr: "sc", name: "Surgical Clearance", color: "red" },
  { abbr: "rfr", name: "Referrals", color: "red" },
  { abbr: "prm", name: "Promotion" },
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
