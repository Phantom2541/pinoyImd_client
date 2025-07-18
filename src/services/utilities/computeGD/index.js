import { Categories, HMO, Memberships } from "../../fakeDb";

const individual = (
  menu,
  category,
  privilege,
  membership,
  hmoCode,
  contract
) => {
  const { isPromo, promo = 0, discountable } = menu;

  const _abbr = ["wi", "bp", "mc", "mbs", "sc", "rfr"].includes(category)
    ? "opd"
    : category;

  var gross = menu[_abbr];

  const isWellness = _abbr === "wls";
  if (_abbr === "wls") gross = HMO.getSrp(hmoCode, menu?.hmo);
  if (_abbr === "ctr") gross = menu?.[contract];

  let up = (gross * 80) / 100;
  if (membership && category === "mbs" && discountable) {
    const dr = Memberships.getDiscount(membership) || 0;
    const discount = gross * dr;
    up = gross - discount;
    return {
      gross,
      up,
      discount,
      color: "success",
      title: "Member Discount",
    };
  }

  if (privilege === 4 && !isWellness) {
    up = promo > 0 ? promo : up;

    return {
      gross,
      up,
      discount: gross - up,
      color: "info",
      title: "Special Discount",
    };
  }

  if (category === "opd" && isPromo && !isWellness)
    return {
      gross,
      up: promo,
      discount: gross - promo,
      color: "warning",
      title: "Promo Price",
    };

  if (privilege > 0 && discountable && !isWellness)
    return {
      gross,
      up,
      discount: gross - up,
      color: "success",
      title: "Discounted Price",
    };

  return {
    gross,
    up: gross,
    discount: 0,
    color: privilege && "danger",
    title: privilege
      ? "Special services, discount is not applicable."
      : "Suggested Retail Price",
  };
};

const computeGD = (
  menu,
  categoryIndex,
  privilege,
  membership,
  hmoCode,
  contract
) => {
  const category = Categories[categoryIndex] || {}; // Ensure category is always an object
  // console.log("category", category);

  const abbr = category.abbr || ""; // Fallback to an empty string if undefined

  if (!Array.isArray(menu))
    return individual(menu, abbr, privilege, membership, hmoCode, contract);

  const accumulator = {
    gross: 0,
    discount: 0,
  };

  for (const item of menu) {
    const { gross = 0, discount = 0 } = individual(
      item,
      abbr,
      privilege,
      membership,
      hmoCode,
      contract
    );
    accumulator.gross += gross;
    accumulator.discount += discount;
  }

  return accumulator;
};

const allServicesHavePrices = (cart, categoryIndex, hmoCode, contract) => {
  if (cart?.length === 0) return false;

  const category = Categories[categoryIndex] || {};
  const categoryAbbr = category.abbr || ""; // Fallback to an empty string if undefined
  return [...cart].every((menu) => {
    const _abbr = ["wi", "bp", "mc", "mbs", "sc", "rfr", "opd"].includes(
      categoryAbbr
    )
      ? "opd"
      : category;
    if (categoryAbbr === "wls") {
      return HMO.getSrp(hmoCode, menu?.hmo) > 0;
    }
    if (categoryAbbr === "ctr") return menu?.[contract] > 0;

    return menu[_abbr] > 0;
  });
};

export { computeGD, allServicesHavePrices };
