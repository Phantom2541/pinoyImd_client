import { Categories } from "../../fakeDb";

const individual = (menu, abbr, privilege) => {
  const { isPromo, promo = 0, discountable } = menu;

  const gross = menu[abbr],
    up = (gross * 80) / 100;

  if (privilege === 4) {
    const _up = promo > 0 ? promo : up;

    return {
      gross,
      up: _up,
      discount: gross - _up,
      color: "info",
      title: "Special Discount",
    };
  }

  if (abbr === "opd" && isPromo)
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

const computeGD = (menu, categoryIndex, privilege) => {
  const category = Categories[categoryIndex] || {}; // Ensure category is always an object
  const abbr = category.abbr || ""; // Fallback to an empty string if undefined

  if (!Array.isArray(menu)) return individual(menu, abbr, privilege);

  const accumulator = {
    gross: 0,
    discount: 0,
  };

  for (const item of menu) {
    const { gross, discount } = individual(item, abbr, privilege);
    accumulator.gross += gross;
    accumulator.discount += discount;
  }

  return accumulator;
};

export default computeGD;
