import { Categories, Memberships } from "../../fakeDb";

const individual = (menu, category, privilege, membership) => {
  const { isPromo, promo = 0, discountable } = menu;

  const _abbr = ["wi", "bp", "mc", "is", "sc"].includes(category)
    ? "opd"
    : category;
  const gross = menu[_abbr];

  const hasMembership = ["is", "hmo"].includes(category);

  let up = (gross * 80) / 100;
  if (membership && hasMembership && discountable) {
    const dr = Memberships.find((m) => m.value === membership)?.discount || 0;
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

  if (privilege === 4) {
    up = promo > 0 ? promo : up;

    return {
      gross,
      up,
      discount: gross - up,
      color: "info",
      title: "Special Discount",
    };
  }

  if (category === "opd" && isPromo)
    return {
      gross,
      up: promo,
      discount: gross - promo,
      color: "warning",
      title: "Promo Price",
    };

  if (privilege > 0 && discountable)
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

const computeGD = (menu, categoryIndex, privilege, membership) => {
  const category = Categories[categoryIndex] || {}; // Ensure category is always an object
  // console.log("category", category);

  const abbr = category.abbr || ""; // Fallback to an empty string if undefined

  if (!Array.isArray(menu))
    return individual(menu, abbr, privilege, membership);

  const accumulator = {
    gross: 0,
    discount: 0,
  };

  for (const item of menu) {
    const { gross, discount } = individual(item, abbr, privilege, membership);
    accumulator.gross += gross;
    accumulator.discount += discount;
  }

  return accumulator;
};

export default computeGD;
