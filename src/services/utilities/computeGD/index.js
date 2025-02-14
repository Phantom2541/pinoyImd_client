import { Categories } from "../../fakeDb";

const individual = (menu, abbr, privilegeIndex) => {
  const { isPromo, promo = 0, isNew, discountable } = menu;

  const gross = menu[abbr],
    up = (gross * 80) / 100;

  if (!isNew)
    return {
      gross: 0,
      up: 0,
      discount: 0,
    };

  if (privilegeIndex === 4) {
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

  if (privilegeIndex > 0 && discountable)
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
    color: privilegeIndex && "danger",
    title: privilegeIndex
      ? "Special services, discount is not applicable."
      : "Suggested Retail Price",
  };
};

const computeGD = (cart, categoryIndex, privilegeIndex) => {
  const { abbr = "" } = Categories[categoryIndex];

  if (!Array.isArray(cart)) return individual(cart, abbr, privilegeIndex);

  const accumulator = {
    gross: 0,
    discount: 0,
  };

  for (const menu of cart) {
    const { gross, discount } = individual(menu, abbr, privilegeIndex);
    accumulator.gross += gross;
    accumulator.discount += discount;
  }

  return accumulator;
};

export default computeGD;
