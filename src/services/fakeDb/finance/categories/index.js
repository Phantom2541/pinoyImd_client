const Categories = [
  { name: "Walkin", abbr: "wi", color: "green" },
  { name: "Out Patient Department", abbr: "opd", color: "blue" },
  { name: "Emergency Room", abbr: "er", color: "blue" },
  { name: "Charity Ward", abbr: "cw", color: "blue" },
  { name: "Private Ward", abbr: "pw", color: "blue" },
  { name: "Insourcing (Wellness)", abbr: "wls", color: "orange" },
  { name: "Insourcing (Membership)", abbr: "mbs", color: "orange" },
  { name: "Insourcing (Contract )", abbr: "ctr", color: "orange" },
  { name: "Business Permit", abbr: "bp", color: "red" },
  { name: "Medical Clearance", abbr: "mc", color: "red" },
  { name: "Surgical Clearance", abbr: "sc", color: "red" },
  { name: "Referrals", abbr: "rfr", color: "red" },
  { name: "Promotion", abbr: "promo" },
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
