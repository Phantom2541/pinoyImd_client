import { Categories, HMO, Memberships } from "../../fakeDb";

const individual = (menu, category, privilege, cardHolder) => {
  const { onPromo: isPromo = false, promo = 0, discountable = false } = menu;
  const _abbr = ["wi", "bp", "mc", "mbs", "sc", "rfr"].includes(category)
    ? "opd"
    : category;

  var gross = menu[_abbr];
  const { type = "", company = {}, tier = "" } = cardHolder || {};
  const isWellness = type === "wls";
  if (type === "wls") gross = HMO.getSrp(company.name, menu?.hmo);
  if (type === "ctr") gross = menu?.[tier];

  let up = Math.round((gross * 80) / 100);
  if (isPromo) {
    return {
      gross,
      up: promo,
      discount: gross - promo,
      color: "danger",
      title: "Promo",
    };
  }

  if (type && type === "mbs" && discountable) {
    const dr = Memberships.getDiscount(tier) || 0;
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
    return {
      gross,
      up,
      discount: gross - up,
      color: "primary",
      title: "Special Price",
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

const computeGD = (menu, categoryIndex, privilege, cardHolder) => {
  const category = Categories[categoryIndex] || {}; // Ensure category is always an object
  // console.log("category", category);

  const abbr = category.abbr || ""; // Fallback to an empty string if undefined

  if (!Array.isArray(menu))
    return individual(menu, abbr, privilege, cardHolder);

  const accumulator = {
    gross: 0,
    discount: 0,
  };

  for (const item of menu) {
    const { gross = 0, discount = 0 } = individual(
      item,
      abbr,
      privilege,
      cardHolder
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
