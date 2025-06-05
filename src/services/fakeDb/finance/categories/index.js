const Categories = [
  { name: "Walkin", abbr: "wi", color: "green" },
  { name: "Out Patient Department", abbr: "opd", color: "green" },
  { name: "Emergency Room", abbr: "er", color: "blue" },
  { name: "Charity Ward", abbr: "cw", color: "blue" },
  { name: "Private Ward", abbr: "pw", color: "blue" },
  { name: "Promotion", abbr: "promo", color: "#E6B800" },
  { name: "Health Maintenance Organization", abbr: "hmo", color: "orange" },
  { name: "Insourcing", abbr: "is", color: "orange" },
  { name: "Business Permit", abbr: "bp", color: "orange" },
  { name: "Medical Clearance", abbr: "mc", color: "red" },
  { name: "Surgical Clearance", abbr: "sc", color: "red" },
  { name: "Sub Contract", abbr: "sbc", color: "purple" },
  { name: "Special Sub Contract", abbr: "ssc", color: "purple" },
];

export default Categories;

// Discount Policy Explanation:
//
// 1. Insourcing ("is"):
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
// - "is" → dynamic discount from SRP based on membership.
// - others → fixed or predefined pricing, not tied to SRP.
